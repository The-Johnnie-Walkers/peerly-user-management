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
            osmId: string;
            osmType: string;
            displayName: string;
            latitude: number;
            longitude: number;
            address: string;
            accuracy: number;
        };
        totalPlaces: number;
    };
}
