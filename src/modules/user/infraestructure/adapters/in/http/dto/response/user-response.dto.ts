import { FreeTimeSchedule } from "src/modules/user/domain/entities/free-time-schedule.entity";
import { Interest } from "src/modules/user/domain/entities/interest.entity";
import { Program } from "src/modules/user/domain/enums/program.enum";
import { Status } from "src/modules/user/domain/enums/status.enum";

export class UserResponseDTO{
    
    username: string;

    name: string;
    
    lastname: string;

    email: string;

    description: string;

    interests: Interest[];

    profielPicURL: string;

    lastTimeConnected: Date;

    semester: number;

    isOnline: boolean;

    isVerified: boolean;

    createdAt: Date;

    updatedAt: Date;

    freeTimeSchedule: FreeTimeSchedule[]
    
    status: Status;

    program: Program;
}