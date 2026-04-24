import { DeleteInterestUseCase } from '../../../domain/ports/in/interest/delete-interest-use-case.port';
import type { InterestRepositoryOutPort } from '../../../domain/ports/out/interest-repository-out.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteInterestUseCaseImpl implements DeleteInterestUseCase {
  constructor(
    @Inject('InterestRepositoryOutPortToken')
    private interestRepositoryPort: InterestRepositoryOutPort,
  ) { }

  async deleteInterestById(id: string): Promise<void> {
    await this.interestRepositoryPort.deleteById(id);
    return Promise.resolve();
  }
}
