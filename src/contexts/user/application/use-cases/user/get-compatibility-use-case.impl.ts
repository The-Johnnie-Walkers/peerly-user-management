import { Inject, Injectable } from '@nestjs/common';
import { GetCompatibilityUseCase } from '../../../domain/ports/in/user/get-compatibility-use-case.port';
import type { UserRepositoryOutPort } from '../../../domain/ports/out/user-repository-out.port';
import { ConnectionMessagingClientService } from '../../../infrastructure/adapters/out/messaging/connection-messaging-client.service';
import { DiscoverUsersUseCaseImpl } from './discover-users-use-case.impl';

@Injectable()
export class GetCompatibilityUseCaseImpl implements GetCompatibilityUseCase {
  constructor(
    @Inject('UserRepositoryOutPortToken')
    private readonly userRepo: UserRepositoryOutPort,
    private readonly connectionClient: ConnectionMessagingClientService,
    private readonly discoverUseCase: DiscoverUsersUseCaseImpl,
  ) {}

  async getCompatibility(userId: string, otherId: string): Promise<number> {
    const [me, other] = await Promise.all([
      this.userRepo.findById(userId),
      this.userRepo.findById(otherId),
    ]);

    const connectionsResponse = await this.connectionClient.getAllConnections();
    const allConnections: Array<{ requesterId: string; receiverId: string; status: string }> =
      connectionsResponse.connections ?? [];

    const myFriendIds = new Set<string>(
      allConnections
        .filter(c => c.status === 'ACCEPTED' && (c.requesterId === userId || c.receiverId === userId))
        .map(c => c.requesterId === userId ? c.receiverId : c.requesterId),
    );

    // Reutilizar el método privado del discover use case via cast
    return (this.discoverUseCase as any).calculateCompatibility(me, other, myFriendIds, allConnections);
  }
}
