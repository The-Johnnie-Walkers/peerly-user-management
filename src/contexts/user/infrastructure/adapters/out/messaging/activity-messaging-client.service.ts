import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ActivityPatterns } from '../../../../../../shared/messaging/patterns/activity.patterns';
import { CreateActivityCommand } from '../../../../../../shared/messaging/contracts/activity/create-activity.command';
import { UpdateActivityCommand } from '../../../../../../shared/messaging/contracts/activity/update-activity.command';
import { DeleteActivityCommand } from '../../../../../../shared/messaging/contracts/activity/delete-activity.command';
import { ReserveSlotCommand } from '../../../../../../shared/messaging/contracts/activity/reserve-slot.command';
import { ReleaseSlotCommand } from '../../../../../../shared/messaging/contracts/activity/release-slot.command';
import { ActivityCommandResponse } from '../../../../../../shared/messaging/contracts/activity/activity-command.response';
import { ActivityQueryResponse } from '../../../../../../shared/messaging/contracts/activity/activity-query.response';

@Injectable()
export class ActivityMessagingClientService {
    constructor(
        @Inject('ACTIVITY_SERVICE') private readonly client: ClientProxy,
    ) {}

    async createActivity(command: CreateActivityCommand): Promise<ActivityCommandResponse> {
        return firstValueFrom(
            this.client.send<ActivityCommandResponse>(ActivityPatterns.CREATE, command),
        );
    }

    async updateActivity(command: UpdateActivityCommand): Promise<ActivityCommandResponse> {
        return firstValueFrom(
            this.client.send<ActivityCommandResponse>(ActivityPatterns.UPDATE, command),
        );
    }

    async deleteActivity(command: DeleteActivityCommand): Promise<void> {
        return firstValueFrom(
            this.client.send<void>(ActivityPatterns.DELETE, command),
        );
    }

    async reserveSlot(command: ReserveSlotCommand): Promise<ActivityCommandResponse> {
        return firstValueFrom(
            this.client.send<ActivityCommandResponse>(ActivityPatterns.RESERVE_SLOT, command),
        );
    }

    async releaseSlot(command: ReleaseSlotCommand): Promise<ActivityCommandResponse> {
        return firstValueFrom(
            this.client.send<ActivityCommandResponse>(ActivityPatterns.RELEASE_SLOT, command),
        );
    }

    async getActivityById(activityId: string): Promise<ActivityQueryResponse> {
        return firstValueFrom(
            this.client.send<ActivityQueryResponse>(ActivityPatterns.GET_BY_ID, { activityId }),
        );
    }

    async getAllActivities(): Promise<ActivityQueryResponse> {
        return firstValueFrom(
            this.client.send<ActivityQueryResponse>(ActivityPatterns.GET_ALL, {}),
        );
    }
}
