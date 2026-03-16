import { Injectable } from "@nestjs/common";
import { UserRequestDTO } from "../../infraestructure/adapters/in/http/dto/request/user-request.dto";
import { User } from "../../domain/entities/user.entity";
import { Status } from "../../domain/enums/status.enum";
import { UserResponseDTO } from "../../infraestructure/adapters/in/http/dto/response/user-response.dto";



@Injectable()
export class UserMapperApplication {
    toDomain(userRequest: UserRequestDTO): User {
        return new User (
            '',
            userRequest.username,
            userRequest.name,
            userRequest.lastname,
            userRequest.email,
            userRequest.description ?? '',
            userRequest.birthDate,
            userRequest.interests ?? [],
            userRequest.profilePicURL ?? '',
            new Date(),
            userRequest.semester,
            false,
            false,
            new Date(),
            new Date(),
            userRequest.freeTimeSchedule ?? [],
            userRequest.status ?? Status.ACTIVE,
            userRequest.program
        );
    }


    mergeForUpdate(currentUser: User, dto: UserRequestDTO): User {
      currentUser.username = dto.username;
      currentUser.name = dto.name;
      currentUser.lastname = dto.lastname;
      currentUser.email = dto.email;
      currentUser.description = dto.description ?? currentUser.description;
      currentUser.birthDate = dto.birthDate;
      currentUser.interests = dto.interests ?? [];
      currentUser.profilePicURL = dto.profilePicURL ?? currentUser.profilePicURL;
      currentUser.semester = dto.semester;
      currentUser.freeTimeSchedule = dto.freeTimeSchedule ?? [];
      currentUser.status = dto.status;
      currentUser.program = dto.program;
      currentUser.updatedAt = new Date();

      return currentUser;
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
        lastTimeConnected: user.lastTimeConnected,
        semester: user.semester,
        isOnline: user.isOnline,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        freeTimeSchedule: user.freeTimeSchedule,
        status: user.status,
        program: user.program,
      }
    }
}