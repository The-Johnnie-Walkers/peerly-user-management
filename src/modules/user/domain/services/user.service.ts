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


    createUser(user: User): Promise<User> {
        return this.userRepositoryOutPort.create(user);
    }

    updateUser(id: string, user: User): Promise<User> {
        return this.userRepositoryOutPort.update(id, user);
    }

    deleteUserById(id: string): void {
        this.userRepositoryOutPort.deleteById(id);
    }

    getUserById(id: string): Promise<User> {
        return this.userRepositoryOutPort.getById(id);
    }

    getAllUsers(): Promise<User[]> {
        return this.userRepositoryOutPort.getAll();
    }

}