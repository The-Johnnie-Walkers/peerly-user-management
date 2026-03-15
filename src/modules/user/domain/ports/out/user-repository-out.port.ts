import { User } from "../../entities/user.entity";

export interface UserRepositoryOutPort {

    create(user: User): User;

    update(id: string, user: User): User;

    deleteById(id: string): void;

    getAll(): User[];

    getById(id: string): User;
    
}