import { Interest } from '../../../entities/interest.entity';

export interface GetAllInterestsUseCase {
  getAllInterests(): Promise<Interest[]>;
}
