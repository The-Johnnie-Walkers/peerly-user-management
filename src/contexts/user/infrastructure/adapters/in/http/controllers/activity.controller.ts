import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityMessagingClientService } from '../../../out/messaging/activity-messaging-client.service';
import { CreateActivityRequestDTO } from '../dto/request/create-activity-request.dto';
import { UpdateActivityRequestDTO } from '../dto/request/update-activity-request.dto';
import { User } from '../../../../../domain/entities/user.entity';
import { UserDocument } from '../../../out/persistence/entities/user.schema';

@Controller('activities')
export class ActivityController {
    constructor(
        private readonly activityMessagingClient: ActivityMessagingClientService,
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    private async assertUserExists(userId: string) {
        const user = await this.userModel.findById(userId).lean().exec();

        if (!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }
    }

    private async removeMissingJoinedActivities(userId: string, activityIds: string[]) {
        if (!activityIds.length) {
            return [];
        }

        const results = await Promise.allSettled(
            activityIds.map(async (activityId) => ({
                activityId,
                response: await this.activityMessagingClient.getActivityById(activityId),
            })),
        );

        const rejectedResult = results.find((result) => result.status === 'rejected');
        if (rejectedResult && rejectedResult.status === 'rejected') {
            throw new InternalServerErrorException('Could not validate joined activities');
        }

        const staleActivityIds = results.flatMap((result) => {
            if (result.status === 'fulfilled' && !result.value.response.success) {
                return [result.value.activityId];
            }

            return [];
        });

        if (staleActivityIds.length) {
            await this.userModel.findByIdAndUpdate(userId, {
                $pullAll: { joinedActivityIds: staleActivityIds },
            }).exec();
        }

        return activityIds.filter((activityId) => !staleActivityIds.includes(activityId));
    }

    @Get('joined/:userId')
    async getJoinedActivities(@Param('userId') userId: string) {
        const user = await this.userModel
            .findById(userId, { joinedActivityIds: 1 })
            .lean()
            .exec();

        if (!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }

        const activityIds = await this.removeMissingJoinedActivities(userId, user.joinedActivityIds ?? []);

        return {
            userId,
            activityIds,
        };
    }

    @Post()
    async create(@Body() dto: CreateActivityRequestDTO) {
        const response = await this.activityMessagingClient.createActivity({
            requesterId: dto.requesterUserId,
            name: dto.name,
            description: dto.description,
            startsAt: dto.startsAt,
            endsAt: dto.endsAt,
            status: dto.status,
            location: dto.location,
            totalPlaces: dto.totalPlaces,
        });

        if (response.success) {
            await this.userModel.findByIdAndUpdate(dto.requesterUserId, {
                $addToSet: { joinedActivityIds: response.activityId },
            }).exec();
        }

        return response;
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
        const response = await this.activityMessagingClient.deleteActivity({ activityId: id });
        if (!response.success) {
            throw new InternalServerErrorException(response.message ?? 'The activity could not be deleted');
        }
        await this.userModel.updateMany(
            { joinedActivityIds: id },
            { $pull: { joinedActivityIds: id } },
        ).exec();
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
        await this.assertUserExists(userId);

        const response = await this.activityMessagingClient.reserveSlot({ activityId, userId });

        if (response.success) {
            await this.userModel.findByIdAndUpdate(userId, {
                $addToSet: { joinedActivityIds: activityId },
            }).exec();
        }

        return response;
    }

    @Post(':id/leave')
    async leave(
        @Param('id') activityId: string,
        @Body('userId') userId: string,
    ) {
        await this.assertUserExists(userId);

        const response = await this.activityMessagingClient.releaseSlot({ activityId, userId });

        if (response.success) {
            await this.userModel.findByIdAndUpdate(userId, {
                $pull: { joinedActivityIds: activityId },
            }).exec();
        }

        return response;
    }
}
