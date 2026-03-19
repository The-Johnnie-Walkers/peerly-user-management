import { User } from "../../entities/user.entity";

export interface UserRepositoryOutPort {

    save( user: User): Promise<User>;

    update(id: string, user: User): Promise<User>;

    findById( id: string ): Promise<User>;

    deleteById(id: string): Promise<void>;

    findAll(): Promise<User[]>;
    
}