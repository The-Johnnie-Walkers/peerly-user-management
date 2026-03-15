import { User } from "../../entities/user.entity";

export interface CreateUserUseCase {

    createUser(user: User): User;
    
}