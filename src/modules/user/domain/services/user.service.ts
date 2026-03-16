import { User } from '../entities/user.entity';
import { CreateUserUseCase } from '../ports/in/create-user-use-case.port'
import { DeleteUserUseCase } from '../ports/in/delete-user-use-case.port';
import { GetAllUsersUseCase } from '../ports/in/get-all-users-use-case.port';
import { GetUserUseCase } from '../ports/in/get-user-use-case.port';
import { UpdateUserUseCase } from '../ports/in/update-user-use-case.port';
import { UserRepositoryOutPort } from '../ports/out/user-repository-out.port';


export class UserService implements CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase, GetUserUseCase, GetAllUsersUseCase {

    constructor(
        private userRepositoryOutPort: UserRepositoryOutPort
    ){}


    async createUser(user: User): Promise<User> {
        return await this.userRepositoryOutPort.create(user);
    }

    async updateUser(id: string, user: User): Promise<User> {
        return await this.userRepositoryOutPort.update(id, user);
    }

    async deleteUserById(id: string): Promise<void> {
        await this.userRepositoryOutPort.deleteById(id);
    }

    async getUserById(id: string): Promise<User> {
        return await this.userRepositoryOutPort.getById(id);
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepositoryOutPort.getAll();
    }

}