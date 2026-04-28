import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { DiscoverUsersUseCase } from '../../../domain/ports/in/user/discover-users-use-case.port';
import type { UserRepositoryOutPort } from '../../../domain/ports/out/user-repository-out.port';
import { ConnectionMessagingClientService } from '../../../infrastructure/adapters/out/messaging/connection-messaging-client.service';
import { FreeTimeSchedule } from '../../../domain/entities/free-time-schedule.entity';

/**
 * Pesos del algoritmo de compatibilidad:
 *   Intereses en común   30%
 *   Disponibilidad       20%
 *   Carrera              20%
 *   Amigos en común      10%
 *   Semestre             7%
 *   Edad                 3%
 *   (reservado)          10%  ← margen para no superar 100 con datos incompletos
 */
const WEIGHTS = {
  interests: 0.30,
  availability: 0.20,
  career: 0.20,
  mutualFriends: 0.10,
  semester: 0.07,
  age: 0.03,
};

@Injectable()
export class DiscoverUsersUseCaseImpl implements DiscoverUsersUseCase {
  constructor(
    @Inject('UserRepositoryOutPortToken')
    private readonly userRepo: UserRepositoryOutPort,
    private readonly connectionClient: ConnectionMessagingClientService,
  ) {}

  async discoverUsers(userId: string): Promise<User[]> {
    // 1. Obtener el usuario solicitante y todos los demás
    const [me, allUsers] = await Promise.all([
      this.userRepo.findById(userId),
      this.userRepo.findAll(),
    ]);

    // 2. Obtener todas las conexiones (cualquier estado) del usuario actual
    const connectionsResponse = await this.connectionClient.getAllConnections();
    const allConnections: Array<{ requesterId: string; receiverId: string; status: string }> =
      connectionsResponse.connections ?? [];

    // IDs con los que ya tengo alguna relación (cualquier estado)
    const myRelatedIds = new Set<string>(
      allConnections
        .filter(c => c.requesterId === userId || c.receiverId === userId)
        .map(c => c.requesterId === userId ? c.receiverId : c.requesterId),
    );

    // IDs de mis conexiones ACEPTADAS (para calcular amigos en común)
    const myFriendIds = new Set<string>(
      allConnections
        .filter(
          c =>
            c.status === 'ACCEPTED' &&
            (c.requesterId === userId || c.receiverId === userId),
        )
        .map(c => c.requesterId === userId ? c.receiverId : c.requesterId),
    );

    // 3. Filtrar candidatos: excluir yo mismo y usuarios con relación existente
    const candidates = allUsers.filter(
      u => u.id !== userId && !myRelatedIds.has(u.id),
    );

    // 4. Calcular score para cada candidato y ordenar de mayor a menor
    const scored = candidates.map(candidate => ({
      user: candidate,
      score: this.calculateCompatibility(me, candidate, myFriendIds, allConnections),
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.map(s => s.user);
  }

  // ─── Algoritmo de compatibilidad (público para reutilización) ───────────────

  calculateCompatibility(
    me: User,
    other: User,
    myFriendIds: Set<string>,
    allConnections: Array<{ requesterId: string; receiverId: string; status: string }>,
  ): number {
    const interestsScore = this.scoreInterests(me, other);
    const availabilityScore = this.scoreAvailability(me, other);
    const careerScore = this.scoreCareer(me, other);
    const mutualScore = this.scoreMutualFriends(other.id, myFriendIds, allConnections);
    const semesterScore = this.scoreSemester(me, other);
    const ageScore = this.scoreAge(me, other);

    const raw =
      interestsScore * WEIGHTS.interests +
      availabilityScore * WEIGHTS.availability +
      careerScore * WEIGHTS.career +
      mutualScore * WEIGHTS.mutualFriends +
      semesterScore * WEIGHTS.semester +
      ageScore * WEIGHTS.age;

    // Normalizar al rango 0-100 y redondear
    return Math.round(raw * 100);
  }

  /** Intereses: Jaccard similarity entre los conjuntos de IDs */
  private scoreInterests(me: User, other: User): number {
    const myIds = new Set((me.interests ?? []).map(i => i.id));
    const otherIds = new Set((other.interests ?? []).map(i => i.id));
    if (myIds.size === 0 && otherIds.size === 0) return 0;

    const intersection = [...myIds].filter(id => otherIds.has(id)).length;
    const union = new Set([...myIds, ...otherIds]).size;
    return union === 0 ? 0 : intersection / union;
  }

  /** Disponibilidad: solapamiento de minutos entre franjas del mismo día */
  private scoreAvailability(me: User, other: User): number {
    const mySlots = me.freeTimeSchedule ?? [];
    const otherSlots = other.freeTimeSchedule ?? [];
    if (mySlots.length === 0 || otherSlots.length === 0) return 0;

    let overlapMinutes = 0;
    let totalMinutes = 0;

    for (const mySlot of mySlots) {
      const myStart = this.toMinutes(mySlot.startsAt);
      const myEnd = this.toMinutes(mySlot.endsAt);
      totalMinutes += myEnd - myStart;

      for (const otherSlot of otherSlots) {
        if (otherSlot.dayOfTheWeek !== mySlot.dayOfTheWeek) continue;
        const otherStart = this.toMinutes(otherSlot.startsAt);
        const otherEnd = this.toMinutes(otherSlot.endsAt);
        const overlap = Math.max(0, Math.min(myEnd, otherEnd) - Math.max(myStart, otherStart));
        overlapMinutes += overlap;
      }
    }

    return totalMinutes === 0 ? 0 : Math.min(1, overlapMinutes / totalMinutes);
  }

  /** Carrera: 1 si comparten al menos un programa, 0 si no */
  private scoreCareer(me: User, other: User): number {
    const myPrograms = new Set(me.programs ?? []);
    return (other.programs ?? []).some(p => myPrograms.has(p)) ? 1 : 0;
  }

  /** Amigos en común: amigos del candidato que también son mis amigos */
  private scoreMutualFriends(
    otherId: string,
    myFriendIds: Set<string>,
    allConnections: Array<{ requesterId: string; receiverId: string; status: string }>,
  ): number {
    const otherFriendIds = new Set<string>(
      allConnections
        .filter(
          c =>
            c.status === 'ACCEPTED' &&
            (c.requesterId === otherId || c.receiverId === otherId),
        )
        .map(c => c.requesterId === otherId ? c.receiverId : c.requesterId),
    );

    if (myFriendIds.size === 0 || otherFriendIds.size === 0) return 0;

    const mutual = [...myFriendIds].filter(id => otherFriendIds.has(id)).length;
    // Normalizar: 1 amigo en común ya da un buen score, escala logarítmica suave
    return Math.min(1, mutual / Math.max(myFriendIds.size, otherFriendIds.size));
  }

  /** Semestre: diferencia máxima considerada = 8 semestres */
  private scoreSemester(me: User, other: User): number {
    const MAX_DIFF = 8;
    const diff = Math.abs((me.semester ?? 1) - (other.semester ?? 1));
    return Math.max(0, 1 - diff / MAX_DIFF);
  }

  /** Edad: diferencia máxima considerada = 10 años */
  private scoreAge(me: User, other: User): number {
    const MAX_DIFF = 10;
    const myAge = this.getAge(me.birthDate);
    const otherAge = this.getAge(other.birthDate);
    if (myAge === null || otherAge === null) return 0;
    const diff = Math.abs(myAge - otherAge);
    return Math.max(0, 1 - diff / MAX_DIFF);
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private toMinutes(date: Date): number {
    const d = new Date(date);
    return d.getUTCHours() * 60 + d.getUTCMinutes();
  }

  private getAge(birthDate: Date | null | undefined): number | null {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }
}
