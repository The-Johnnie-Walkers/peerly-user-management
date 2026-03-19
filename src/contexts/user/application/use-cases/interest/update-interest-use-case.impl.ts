import { Interest } from "src/contexts/user/domain/entities/interest.entity";
import { UpdateInterestUseCase } from "src/contexts/user/domain/ports/in/update-interest-use-case.port";
import { InterestRepositoryOutPort } from "src/contexts/user/domain/ports/out/interest-repository-out.port";

export class UpdateInterestUseCaseImpl implements UpdateInterestUseCase {
    
    constructor(
        private interestRepositoryOutPort: InterestRepositoryOutPort
    ){}

    updateInterest(id: string, interest: Interest): Promise<Interest> {
        return this.interestRepositoryOutPort.update(id, interest);
    }
}