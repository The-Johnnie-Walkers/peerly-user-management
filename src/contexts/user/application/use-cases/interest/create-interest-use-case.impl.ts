import { Interest } from 'src/contexts/user/domain/entities/interest.entity';
import { CreateInterestUseCase } from 'src/contexts/user/domain/ports/in/interest/create-interest-use-case.port';
import type { InterestRepositoryOutPort } from 'src/contexts/user/domain/ports/out/interest-repository-out.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateInterestUseCaseImpl implements CreateInterestUseCase {
  constructor(
    @Inject('InterestRepositoryOutPortToken')
    private interestRepositoryPort: InterestRepositoryOutPort,
  ) { }

  async createInterest(interest: Interest): Promise<Interest> {
    return await this.interestRepositoryPort.save(interest);
  }
}
