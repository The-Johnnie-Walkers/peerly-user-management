import { DeleteInterestUseCase } from "src/contexts/user/domain/ports/in/interest/delete-interest-use-case.port";
import { InterestRepositoryOutPort } from "src/contexts/user/domain/ports/out/interest-repository-out.port";

export class DeleteInterestUseCaseImpl implements DeleteInterestUseCase {
    
    constructor(
        private interestRepositoryOutPort: InterestRepositoryOutPort
    ){}
    
    deleteInterestById(id: string): Promise<void> {
        this.interestRepositoryOutPort.deleteById(id);
        return Promise.resolve();
    }
    
}