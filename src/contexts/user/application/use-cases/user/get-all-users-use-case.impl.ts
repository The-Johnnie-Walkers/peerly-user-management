import { User } from "src/contexts/user/domain/entities/user.entity";
import { GetAllUsersUseCase } from "src/contexts/user/domain/ports/in/user/get-all-users-use-case.port";
import { UserRepositoryOutPort } from "src/contexts/user/domain/ports/out/user-repository-out.port";

export class GetAllUsersUseCaseImpl implements GetAllUsersUseCase {

    constructor(
        private userRepositoryOutPort: UserRepositoryOutPort
    ){}

    getAllUsers(): Promise<User[]> {
        return this.userRepositoryOutPort.findAll();
    }
}