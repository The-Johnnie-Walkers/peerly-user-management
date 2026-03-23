import { Interest } from 'src/contexts/user/domain/entities/interest.entity';
import { UpdateInterestUseCase } from 'src/contexts/user/domain/ports/in/interest/update-interest-use-case.port';
import type { InterestRepositoryOutPort } from 'src/contexts/user/domain/ports/out/interest-repository-out.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateInterestUseCaseImpl implements UpdateInterestUseCase {
  constructor(
    @Inject('InterestRepositoryOutPortToken')
    private interestRepositoryPort: InterestRepositoryOutPort,
  ) { }

  async updateInterest(id: string, interest: Interest): Promise<Interest> {
    return await this.interestRepositoryPort.update(id, interest);
  }
}
