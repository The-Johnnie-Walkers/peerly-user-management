import { User } from "../../entities/user.entity";

export interface GetUserUseCase {

    getUserById(id: string): Promise<User>;

}