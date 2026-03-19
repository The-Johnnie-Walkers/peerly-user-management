import { User } from "../../entities/user.entity";

export interface UserRepositoryOutPort {

    save( user: User): Promise<User>;

    update(id: string, user: User): Promise<User>;

    deleteById(id: string): Promise<void>;

    findById( id: string ): Promise<User>;

    findAll(): Promise<User[]>;
    
}