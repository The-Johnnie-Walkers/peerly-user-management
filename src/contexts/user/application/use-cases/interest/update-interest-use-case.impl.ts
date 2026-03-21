import { Interest } from 'src/contexts/user/domain/entities/interest.entity';
import { UpdateInterestUseCase } from 'src/contexts/user/domain/ports/in/interest/update-interest-use-case.port';
import { InterestRepositoryOutPort } from 'src/contexts/user/domain/ports/out/interest-repository-out.port';

export class UpdateInterestUseCaseImpl implements UpdateInterestUseCase {
  constructor(private interestRepositoryOutPort: InterestRepositoryOutPort) {}

  async updateInterest(id: string, interest: Interest): Promise<Interest> {
    return await this.interestRepositoryOutPort.update(id, interest);
  }
}
