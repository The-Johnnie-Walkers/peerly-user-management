import { Interest } from 'src/contexts/user/domain/entities/interest.entity';
import { GetInterestUseCase } from 'src/contexts/user/domain/ports/in/interest/get-interest-use.case.port';
import { InterestRepositoryOutPort } from 'src/contexts/user/domain/ports/out/interest-repository-out.port';

export class GetInterestUseCaseImpl implements GetInterestUseCase {
  constructor(private interestRepositoryOutPort: InterestRepositoryOutPort) {}

  async getInterestById(id: string): Promise<Interest> {
    return await this.interestRepositoryOutPort.findById(id);
  }
}
