import { User } from '../../domain/entities/user.entity';
import type { CreateUserUseCase } from '../../domain/ports/in/user/create-user-use-case.port';
import type { DeleteUserUseCase } from '../../domain/ports/in/user/delete-user-use-case.port';
import type { GetAllUsersUseCase } from '../../domain/ports/in/user/get-all-users-use-case.port';
import type { GetUserUseCase } from '../../domain/ports/in/user/get-user-use-case.port';
import type { UpdateUserUseCase } from '../../domain/ports/in/user/update-user-use-case.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService implements CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase, GetUserUseCase, GetAllUsersUseCase {
  constructor(
    @Inject('CreateUserUseCaseToken')
    private createUserUseCase: CreateUserUseCase,
    @Inject('UpdateUserUseCaseToken')
    private updateUserUseCase: UpdateUserUseCase,
    @Inject('DeleteUserUseCaseToken')
    private deleteUserUseCase: DeleteUserUseCase,
    @Inject('GetUserUseCaseToken')
    private getUserUseCase: GetUserUseCase,
    @Inject('GetAllUsersUseCaseToken')
    private getAllUsersUseCase: GetAllUsersUseCase,
  ) { }

  async createUser(user: User): Promise<User> {
    user.validateAge();
    return await this.createUserUseCase.createUser(user);
  }

  async updateUser(id: string, user: User): Promise<User> {
    user.validateAge();
    return await this.updateUserUseCase.updateUser(id, user);
  }

  async deleteUserById(id: string): Promise<void> {
    await this.deleteUserUseCase.deleteUserById(id);
    return Promise.resolve();
  }

  async getUserById(id: string): Promise<User> {
    return await this.getUserUseCase.getUserById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.getAllUsersUseCase.getAllUsers();
  }
}
