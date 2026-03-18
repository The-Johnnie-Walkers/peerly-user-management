import { Controller, Post, Put, Delete, Req, Get } from "@nestjs/common";
import type { CreateUserUseCase } from "src/contexts/user/domain/ports/in/create-user-use-case.port";
import type { DeleteUserUseCase } from "src/contexts/user/domain/ports/in/delete-user-use-case.port";
import type { UpdateUserUseCase } from "src/contexts/user/domain/ports/in/update-user-use-case.port";
import { UserResponseDTO } from "../dto/response/user-response.dto";
import { UserRequestDTO } from "../dto/request/user-request.dto";
import { UserMapperApplication } from "src/contexts/user/application/mapper/user-mapper.application";
import type { GetUserUseCase } from "src/contexts/user/domain/ports/in/get-user-use-case.port";
import type { GetAllUsersUseCase } from "src/contexts/user/domain/ports/in/get-all-users-use-case.port";


@Controller('/users')
export class UserController {

    constructor(
        private createUserUseCase: CreateUserUseCase,
        private updateUserUseCase: UpdateUserUseCase,
        private deleteUserUseCase: DeleteUserUseCase,
        private getUserUseCase: GetUserUseCase,
        private getAllUsersUseCase: GetAllUsersUseCase,
        private userMapper: UserMapperApplication
    ) { }

    @Post('')
    async createUser(@Req() userRequest: UserRequestDTO): Promise<UserResponseDTO> {

        const user = this.userMapper.toDomain(userRequest);
        const createUser = await this.createUserUseCase.createUser(user);
        return this.userMapper.toResponse(createUser);
    }

    @Put('/{id}')
    async updateUser(@Req() id: string, @Req() userRequest: UserRequestDTO): Promise<UserResponseDTO> {

        const user = this.userMapper.toDomain(userRequest);
        const userUpdated = await this.updateUserUseCase.updateUser(id, user);
        return this.userMapper.toResponse(userUpdated);
    }

    @Delete('/{id}')
    async deleteUser(@Req() id: string): Promise<void> {
        this.deleteUserUseCase.deleteUserById(id);
        return Promise.resolve();
    }

    @Get('/{id}')
    async getUserById(@Req() id: string): Promise<UserResponseDTO> {
        const user = await this.getUserUseCase.getUserById(id);
        return this.userMapper.toResponse(user);
    }

    @Get('')
    async getAllUsers(): Promise<UserResponseDTO[]> {
        const users = await this.getAllUsersUseCase.getAllUsers();
        return this.userMapper.toResponseList(users);
    }


}