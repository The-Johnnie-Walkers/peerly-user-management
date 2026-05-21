import { User } from '../../../entities/user.entity';

export interface DiscoverUsersUseCase {
  discoverUsers(userId: string): Promise<User[]>;
}
