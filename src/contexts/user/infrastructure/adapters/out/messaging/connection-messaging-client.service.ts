import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConnectionPatterns } from '../../../../../../shared/messaging/patterns/connection.patterns';
import { CommunityPatterns } from '../../../../../../shared/messaging/patterns/community.patterns';
import { CreateConnectionCommand } from '../../../../../../shared/messaging/contracts/connection-ms/create-connection.command'
import { UpdateConnectionCommand } from '../../../../../../shared/messaging/contracts/connection-ms/update-connection.command';
import { DeleteConnectionCommand } from '../../../../../../shared/messaging/contracts/connection-ms/delete-connection.command';
import { JoinCommunityCommand } from '../../../../../../shared/messaging/contracts/community/join-community.command';
import { LeaveCommunityCommand } from '../../../../../../shared/messaging/contracts/community/leave-community.command';
import { CreateCommunityCommand } from '../../../../../../shared/messaging/contracts/community/create-community.command';
import { DeleteCommunityCommand } from '../../../../../../shared/messaging/contracts/community/delete-community.command';
import { ConnectionCommandResponse } from '../../../../../../shared/messaging/contracts/connection-ms/connection-command.response';
import { ConnectionQueryResponse } from '../../../../../../shared/messaging/contracts/connection-ms/connection-query.response';
import { CommunityCommandResponse } from '../../../../../../shared/messaging/contracts/community/community-command.response';
import { CommunityQueryResponse } from '../../../../../../shared/messaging/contracts/community/community-query.response';

@Injectable()
export class ConnectionMessagingClientService {
    constructor(
        @Inject('CONNECTION_SERVICE') private readonly client: ClientProxy,
    ) {}

    async createConnection(command: CreateConnectionCommand): Promise<ConnectionCommandResponse> {
        return firstValueFrom(this.client.send<ConnectionCommandResponse>(ConnectionPatterns.CREATE, command));
    }

    async updateConnection(command: UpdateConnectionCommand): Promise<ConnectionCommandResponse> {
        return firstValueFrom(this.client.send<ConnectionCommandResponse>(ConnectionPatterns.UPDATE, command));
    }

    async deleteConnection(command: DeleteConnectionCommand): Promise<ConnectionCommandResponse> {
        return firstValueFrom(this.client.send<ConnectionCommandResponse>(ConnectionPatterns.DELETE, command));
    }

    async getConnectionById(connectionId: string): Promise<ConnectionQueryResponse> {
        return firstValueFrom(this.client.send<ConnectionQueryResponse>(ConnectionPatterns.GET_BY_ID, { connectionId }));
    }

    async getAllConnections(): Promise<ConnectionQueryResponse> {
        return firstValueFrom(this.client.send<ConnectionQueryResponse>(ConnectionPatterns.GET_ALL, {}));
    }

    async createCommunity(command: CreateCommunityCommand): Promise<CommunityCommandResponse> {
        return firstValueFrom(this.client.send<CommunityCommandResponse>(CommunityPatterns.CREATE, command));
    }

    async deleteCommunity(command: DeleteCommunityCommand): Promise<CommunityCommandResponse> {
        return firstValueFrom(this.client.send<CommunityCommandResponse>(CommunityPatterns.DELETE, command));
    }

    async getCommunityById(communityId: string): Promise<CommunityQueryResponse> {
        return firstValueFrom(this.client.send<CommunityQueryResponse>(CommunityPatterns.GET_BY_ID, { communityId }));
    }

    async getAllCommunities(): Promise<CommunityQueryResponse> {
        return firstValueFrom(this.client.send<CommunityQueryResponse>(CommunityPatterns.GET_ALL, {}));
    }

    async joinCommunity(command: JoinCommunityCommand): Promise<CommunityCommandResponse> {
        return firstValueFrom(this.client.send<CommunityCommandResponse>(CommunityPatterns.JOIN, command));
    }

    async leaveCommunity(command: LeaveCommunityCommand): Promise<CommunityCommandResponse> {
        return firstValueFrom(this.client.send<CommunityCommandResponse>(CommunityPatterns.LEAVE, command));
    }
}