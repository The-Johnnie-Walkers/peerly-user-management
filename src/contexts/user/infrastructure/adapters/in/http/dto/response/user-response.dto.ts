import { FreeTimeSchedule } from "src/contexts/user/domain/entities/free-time-schedule.entity";
import { Interest } from "src/contexts/user/domain/entities/interest.entity";
import { Program } from "src/contexts/user/domain/enums/program.enum";
import { Status } from "src/contexts/user/domain/enums/status.enum";

export class UserResponseDTO {

    username: string;

    name: string;

    lastname: string;

    email: string;

    description?: string;

    interests?: Interest[];

    profilePicURL?: string;

    lastTimeConnected: Date;

    semester: number;

    isOnline: boolean;

    isVerified: boolean;

    createdAt: Date;

    updatedAt: Date;

    freeTimeSchedule?: FreeTimeSchedule[]

    status: Status;

    programs: Program[];
}