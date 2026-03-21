import { Interest } from 'src/contexts/user/domain/entities/interest.entity';
import { CreateInterestUseCase } from 'src/contexts/user/domain/ports/in/interest/create-interest-use-case.port';
import { InterestRepositoryOutPort } from 'src/contexts/user/domain/ports/out/interest-repository-out.port';

export class CreateInterestUseCaseImpl implements CreateInterestUseCase {
  constructor(private interestRepositoryPort: InterestRepositoryOutPort) {}

  async createInterest(interest: Interest): Promise<Interest> {
    return await this.interestRepositoryPort.save(interest);
  }
}
