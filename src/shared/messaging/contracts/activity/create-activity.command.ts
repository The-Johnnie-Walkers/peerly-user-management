import { ActivityStatus } from '../../../enums/activity-status.enum';

export class CreateActivityCommand {
    requesterId!: string;
    name!: string;
    description!: string;
    startsAt!: Date;
    endsAt!: Date;
    status!: ActivityStatus;
    location!: {
        latitude: number;
        longitude: number;
        placeId: string;
        address: string;
        accuracy: number;
    };
    totalPlaces!: number;
}
