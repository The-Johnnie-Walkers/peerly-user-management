import { User } from 'src/contexts/user/domain/entities/user.entity';
import { UserRequestDTO } from '../dto/request/user-request.dto';
import { UserResponseDTO } from '../dto/response/user-response.dto';

export class UserDtoMapper {
  toDomain(userRequest: UserRequestDTO): User {
    return new User({
      id: '',
      username: userRequest.username,
      name: userRequest.name,
      lastname: userRequest.lastname,
      email: userRequest.email,
      description: userRequest.description,
      birthDate: userRequest.birthDate,
      profilePicURL: userRequest.profilePicURL,
      lastTimeConnected: new Date(),
      semester: userRequest.semester,
      isOnline: true,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      freeTimeSchedule: userRequest.freeTimeSchedule,
      status: userRequest.status,
      programs: userRequest.programs,
      role: userRequest.role,
    });
  }

  toResponse(user: User): UserResponseDTO {
    return {
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
    };
  }

  toResponseList(users: User[]): UserResponseDTO[] {
    return users.map((user) => this.toResponse(user));
  }
}
