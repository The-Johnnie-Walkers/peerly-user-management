import { User } from "src/contexts/user/domain/entities/user.entity";
import { CreateUserUseCase } from "src/contexts/user/domain/ports/in/user/create-user-use-case.port";
import { UserRepositoryOutPort } from "src/contexts/user/domain/ports/out/user-repository-out.port";

export class CreateUserUseCaseImpl implements CreateUserUseCase {
    
    constructor(
        private userRepositoryOutPort: UserRepositoryOutPort
    ){}

    createUser(user: User): Promise<User> {
        return this.userRepositoryOutPort.save(user);
    }
}