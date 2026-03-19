import { DeleteUserUseCase } from "src/contexts/user/domain/ports/in/delete-user-use-case.port";
import { UserRepositoryOutPort } from "src/contexts/user/domain/ports/out/user-repository-out.port";

export class DeleteUserUseCaseImpl implements DeleteUserUseCase {

    constructor(
        private userRepositoryOutPort: UserRepositoryOutPort
    ){}

    deleteUserById(id: string): Promise<void> {
        this.userRepositoryOutPort.deleteById(id);
        return Promise.resolve();
    }
}