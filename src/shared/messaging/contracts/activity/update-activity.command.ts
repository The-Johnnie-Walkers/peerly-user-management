import { ActivityStatus } from '../../../enums/activity-status.enum';

export class UpdateActivityCommand {
    activityId!: string;
    updatedActivity!: {
        name: string;
        description: string;
        startsAt: Date;
        endsAt: Date;
        status: ActivityStatus;
        location: {
            latitude: number;
            longitude: number;
            placeId: string;
            address: string;
            accuracy: number;
        };
        totalPlaces: number;
    };
}
