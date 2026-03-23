import { Interest } from 'src/contexts/user/domain/entities/interest.entity';
import { GetAllInterestsUseCase } from 'src/contexts/user/domain/ports/in/interest/get-all-interests-use-case.port';
import type { InterestRepositoryOutPort } from 'src/contexts/user/domain/ports/out/interest-repository-out.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetAllInterestsUseCaseImpl implements GetAllInterestsUseCase {
  constructor(
    @Inject('InterestRepositoryOutPortToken')
    private interestRepositoryPort: InterestRepositoryOutPort,
  ) { }

  async getAllInterests(): Promise<Interest[]> {
    return await this.interestRepositoryPort.findAll();
  }
}
