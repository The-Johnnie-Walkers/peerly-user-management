import { User } from "../../entities/user.entity";

export interface GetAllUsersUseCase {

    getAllUsers(): User[];

}