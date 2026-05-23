import { User } from '../../../../../domain/entities/user.entity';
import { UserRequestDTO } from '../dto/request/user-request.dto';
import { UserResponseDTO } from '../dto/response/user-response.dto';
import { Interest } from '../../../../../domain/entities/interest.entity';
import { FreeTimeSchedule } from '../../../../../domain/entities/free-time-schedule.entity';
import { Category } from '../../../../../domain/enums/category.enum';
import { DayOfTheWeek } from '../../../../../domain/enums/day-of-the-week.enum';

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
      interests: this.mapInterestsToDomain(userRequest.interests),
      profilePicURL: userRequest.profilePicURL,
      lastTimeConnected: new Date(),
      semester: userRequest.semester,
      isOnline: true,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      freeTimeSchedule: this.mapFreeTimeToDomain(userRequest.freeTimeSchedule),
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

  private mapInterestsToDomain(interests: unknown): Interest[] {
    if (!Array.isArray(interests)) return [];

    return interests
      .filter((item) => item != null && item !== '')
      .map((item) => {
        if (typeof item === 'string') {
          return new Interest({ id: item, name: '', category: Category.OTHER });
        }
        const raw = item as { id?: string; name?: string; category?: Category };
        return new Interest({
          id: raw.id ?? '',
          name: raw.name ?? '',
          category: raw.category ?? Category.OTHER,
        });
      })
      .filter((interest) => interest.id.length > 0);
  }

  private mapFreeTimeToDomain(schedule: unknown): FreeTimeSchedule[] {
    if (!Array.isArray(schedule)) return [];

    return schedule
      .filter((item) => item != null)
      .map((ft) => {
        const raw = ft as {
          id?: string;
          startsAt?: string | Date;
          endsAt?: string | Date;
          dayOfTheWeek?: string;
        };
        return new FreeTimeSchedule({
          id: raw.id ?? '',
          startsAt: new Date(raw.startsAt ?? 0),
          endsAt: new Date(raw.endsAt ?? 0),
          dayOfTheWeek: (raw.dayOfTheWeek as DayOfTheWeek) ?? DayOfTheWeek.MONDAY,
        });
      });
  }
}
