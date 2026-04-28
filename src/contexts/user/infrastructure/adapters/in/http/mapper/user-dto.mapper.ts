import { User } from '../../../../../domain/entities/user.entity';
import { UserRequestDTO } from '../dto/request/user-request.dto';
import { UserResponseDTO } from '../dto/response/user-response.dto';
import { Interest } from '../../../../../domain/entities/interest.entity';
import { FreeTimeSchedule } from '../../../../../domain/entities/free-time-schedule.entity';

export class UserDtoMapper {
  toDomain(userRequest: UserRequestDTO): User {
    return new User({
      id: userRequest.id ?? '',
      username: userRequest.username,
      name: userRequest.name,
      lastname: userRequest.lastname,
      email: userRequest.email,
      description: userRequest.description,
      birthDate: userRequest.birthDate,
      interests: userRequest.interests
        ? userRequest.interests.map((i: any) => new Interest({
            // El frontend puede enviar solo el ID como string o como objeto {id, name, category}
            id: typeof i === 'string' ? i : (i.id ?? ''),
            name: typeof i === 'string' ? '' : (i.name ?? ''),
            category: typeof i === 'string' ? null : (i.category ?? null),
          }))
        : [],
      profilePicURL: userRequest.profilePicURL,
      lastTimeConnected: new Date(),
      semester: userRequest.semester,
      isOnline: true,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      freeTimeSchedule: userRequest.freeTimeSchedule
        ? userRequest.freeTimeSchedule.map((ft: any) => new FreeTimeSchedule({
            id: ft.id ?? '',
            startsAt: new Date(ft.startsAt),
            endsAt: new Date(ft.endsAt),
            dayOfTheWeek: ft.dayOfTheWeek,
          }))
        : [],
      status: userRequest.status,
      programs: userRequest.programs,
      role: userRequest.role,
    });
  }

  toResponse(user: User): UserResponseDTO {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      description: user.description,
      interests: user.interests,
      profilePicURL: user.profilePicURL,
      lastTimeConnected: new Date(),
      semester: user.semester,
      isOnline: user.isOnline,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: new Date(),
      freeTimeSchedule: user.freeTimeSchedule,
      status: user.status,
      programs: user.programs,
      role: user.role,
    };
  }

  toResponseList(users: User[]): UserResponseDTO[] {
    return users.map((user) => this.toResponse(user));
  }
}
