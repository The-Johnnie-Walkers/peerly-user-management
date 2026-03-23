import { Interest } from '../../domain/entities/interest.entity';
import type { CreateInterestUseCase } from '../../domain/ports/in/interest/create-interest-use-case.port';
import type { DeleteInterestUseCase } from '../../domain/ports/in/interest/delete-interest-use-case.port';
import type { GetAllInterestsUseCase } from '../../domain/ports/in/interest/get-all-interests-use-case.port';
import type { GetInterestUseCase } from '../../domain/ports/in/interest/get-interest-use.case.port';
import type { UpdateInterestUseCase } from '../../domain/ports/in/interest/update-interest-use-case.port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class InterestService implements CreateInterestUseCase, UpdateInterestUseCase, DeleteInterestUseCase, GetInterestUseCase, GetAllInterestsUseCase {
  constructor(
    @Inject('CreateInterestUseCaseToken')
    private createInterestUseCase: CreateInterestUseCase,
    @Inject('UpdateInterestUseCaseToken')
    private updateInterstUseCase: UpdateInterestUseCase,
    @Inject('DeleteInterestUseCaseToken')
    private deleteInterestUseCase: DeleteInterestUseCase,
    @Inject('GetInterestUseCaseToken')
    private getInterestUseCase: GetInterestUseCase,
    @Inject('GetAllInterestsUseCaseToken')
    private getAllInterestsUseCase: GetAllInterestsUseCase,
  ) { }

  async createInterest(interest: Interest): Promise<Interest> {
    return await this.createInterestUseCase.createInterest(interest);
  }

  async updateInterest(id: string, interest: Interest): Promise<Interest> {
    return await this.updateInterstUseCase.updateInterest(id, interest);
  }

  async deleteInterestById(id: string): Promise<void> {
    await this.deleteInterestUseCase.deleteInterestById(id);
    return Promise.resolve();
  }

  async getInterestById(id: string): Promise<Interest> {
    return await this.getInterestUseCase.getInterestById(id);
  }

  async getAllInterests(): Promise<Interest[]> {
    return await this.getAllInterestsUseCase.getAllInterests();
  }
}
