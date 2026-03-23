import { Interest } from 'src/contexts/user/domain/entities/interest.entity';
import { GetInterestUseCase } from 'src/contexts/user/domain/ports/in/interest/get-interest-use.case.port';
import type { InterestRepositoryOutPort } from 'src/contexts/user/domain/ports/out/interest-repository-out.port';

import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetInterestUseCaseImpl implements GetInterestUseCase {
  constructor(
    @Inject('InterestRepositoryOutPortToken')
    private interestRepositoryPort: InterestRepositoryOutPort,
  ) { }

  async getInterestById(id: string): Promise<Interest> {
    return await this.interestRepositoryPort.findById(id);
  }
}
