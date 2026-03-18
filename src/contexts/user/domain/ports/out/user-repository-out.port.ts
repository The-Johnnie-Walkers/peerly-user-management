import { User } from "../../entities/user.entity";

export interface UserRepositoryOutPort {

    create(user: User): Promise<User>;

    update(id: string, user: User): Promise<User>;

    deleteById(id: string): Promise<void>;

    getAll(): Promise<User[]>;

    getById(id: string): Promise<User>;
    
}