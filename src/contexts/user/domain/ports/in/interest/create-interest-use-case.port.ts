import { Interest } from '../../../entities/interest.entity';

export interface CreateInterestUseCase {
  createInterest(interest: Interest): Promise<Interest>;
}
