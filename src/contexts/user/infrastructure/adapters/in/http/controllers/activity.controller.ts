import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ActivityMessagingClientService } from '../../../out/messaging/activity-messaging-client.service';
import { CreateActivityRequestDTO } from '../dto/request/create-activity-request.dto';
import { UpdateActivityRequestDTO } from '../dto/request/update-activity-request.dto';

@Controller('activities')
export class ActivityController {
    constructor(
        private readonly activityMessagingClient: ActivityMessagingClientService,
    ) {}

    @Post()
    async create(@Body() dto: CreateActivityRequestDTO) {
        return this.activityMessagingClient.createActivity({
            requesterUserId: dto.requesterUserId,
            name: dto.name,
            description: dto.description,
            startsAt: dto.startsAt,
            endsAt: dto.endsAt,
            status: dto.status,
            location: dto.location,
            totalPlaces: dto.totalPlaces,
        });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateActivityRequestDTO) {
        return this.activityMessagingClient.updateActivity({
            activityId: id,
            updatedActivity: {
                name: dto.name,
                description: dto.description,
                startsAt: dto.startsAt,
                endsAt: dto.endsAt,
                status: dto.status,
                location: dto.location,
                totalPlaces: dto.totalPlaces,
            },
        });
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string) {
        await this.activityMessagingClient.deleteActivity({ activityId: id });
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return this.activityMessagingClient.getActivityById(id);
    }

    @Get()
    async getAll() {
        return this.activityMessagingClient.getAllActivities();
    }

    @Post(':id/join')
    async join(
        @Param('id') activityId: string,
        @Body('userId') userId: string,
    ) {
        return this.activityMessagingClient.reserveSlot({ activityId, userId });
    }

    @Post(':id/leave')
    async leave(
        @Param('id') activityId: string,
        @Body('userId') userId: string,
    ) {
        return this.activityMessagingClient.releaseSlot({ activityId, userId });
    }
}
