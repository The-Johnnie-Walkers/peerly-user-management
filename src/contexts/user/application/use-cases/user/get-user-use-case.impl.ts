import { User } from "src/contexts/user/domain/entities/user.entity";
import { GetUserUseCase } from "src/contexts/user/domain/ports/in/user/get-user-use-case.port";
import { UserRepositoryOutPort } from "src/contexts/user/domain/ports/out/user-repository-out.port";

export class GetUserUseCaseImpl implements GetUserUseCase {

    constructor(
        private userRepositoryOutPort: UserRepositoryOutPort
    ){}

    getUserById(id: string): Promise<User> {
        return this.userRepositoryOutPort.findById(id);
    }
}