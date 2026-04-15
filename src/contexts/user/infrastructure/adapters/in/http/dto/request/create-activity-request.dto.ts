import { Type } from 'class-transformer';
import {
    IsDate,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';
import { ActivityStatus } from '../../../../../../../../shared/enums/activity-status.enum';

class LocationDTO {
    @IsNotEmpty()
    latitude!: number;

    @IsNotEmpty()
    longitude!: number;

    @IsNotEmpty()
    @IsString()
    placeId!: string;

    @IsNotEmpty()
    @IsString()
    address!: string;

    @IsNotEmpty()
    accuracy!: number;
}

export class CreateActivityRequestDTO {
    @IsNotEmpty()
    @IsString()
    requesterUserId!: string;

    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsString()
    description!: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startsAt!: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    endsAt!: Date;

    @IsEnum(ActivityStatus)
    status!: ActivityStatus;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LocationDTO)
    location!: LocationDTO;

    @IsInt()
    @Min(2)
    @IsNotEmpty()
    totalPlaces!: number;
}
