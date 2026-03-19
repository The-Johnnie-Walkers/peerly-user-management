import { User } from "src/contexts/user/domain/entities/user.entity";
import { UpdateUserUseCase } from "src/contexts/user/domain/ports/in/update-user-use-case.port";
import { UserRepositoryOutPort } from "src/contexts/user/domain/ports/out/user-repository-out.port";

export class UpdateUserUseCaseImpl implements UpdateUserUseCase {
    
    constructor(
        private userRepositoryOutPort: UserRepositoryOutPort
    ){}

    updateUser(id: string, user: User): Promise<User> {
        return this.userRepositoryOutPort.update(id, user);
    }
}