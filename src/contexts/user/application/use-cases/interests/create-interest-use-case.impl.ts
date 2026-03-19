import { Interest } from "src/contexts/user/domain/entities/interest.entity";
import { CreateInterestUseCase } from "src/contexts/user/domain/ports/in/create-interest-use-case.port";
import { InterestRepositoryOutPort } from "src/contexts/user/domain/ports/out/interest-repository-out.port";

export class CreateInterestUseCaseImpl implements CreateInterestUseCase {
    
    constructor(
        private interestRepositoryPort: InterestRepositoryOutPort
    ){}
    
    createInterest(interest: Interest): Promise<Interest> {
        return this.interestRepositoryPort.save(interest);
    }
}