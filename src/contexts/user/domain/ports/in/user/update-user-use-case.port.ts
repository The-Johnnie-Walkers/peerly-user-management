import { User } from "../../../entities/user.entity";

export interface UpdateUserUseCase {

    updateUser(id: string, user: User): Promise<User>;

}