import { User } from "../../entities/user.entity";

export interface GetUserUseCase {

    getUseById(id: string): User;

}