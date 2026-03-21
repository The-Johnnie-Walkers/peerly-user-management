import { Interest } from 'src/contexts/user/domain/entities/interest.entity';
import { GetAllInterestsUseCase } from 'src/contexts/user/domain/ports/in/interest/get-all-interests-use-case.port';
import { InterestRepositoryOutPort } from 'src/contexts/user/domain/ports/out/interest-repository-out.port';

export class GetAllInterestsUseCaseImpl implements GetAllInterestsUseCase {
  constructor(private interestRepositoryOutPort: InterestRepositoryOutPort) {}

  async getAllInterests(): Promise<Interest[]> {
    return await this.interestRepositoryOutPort.findAll();
  }
}
