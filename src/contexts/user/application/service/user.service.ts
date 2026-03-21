import { User } from '../../domain/entities/user.entity';
import { CreateUserUseCase } from '../../domain/ports/in/user/create-user-use-case.port';
import { DeleteUserUseCase } from '../../domain/ports/in/user/delete-user-use-case.port';
import { GetAllUsersUseCase } from '../../domain/ports/in/user/get-all-users-use-case.port';
import { GetUserUseCase } from '../../domain/ports/in/user/get-user-use-case.port';
import { UpdateUserUseCase } from '../../domain/ports/in/user/update-user-use-case.port';

export class UserService
  implements
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    GetAllUsersUseCase
{
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private getAllUsersUseCase: GetAllUsersUseCase,
  ) {}

  async createUser(user: User): Promise<User> {
    return await this.createUserUseCase.createUser(user);
  }

  async updateUser(id: string, user: User): Promise<User> {
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
