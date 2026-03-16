import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { FreeTimeSchedule } from 'src/modules/user/domain/entities/free-time-schedule.entity';
import { Interest } from 'src/modules/user/domain/entities/interest.entity';
import { Program } from 'src/modules/user/domain/enums/program.enum';
import { Status } from 'src/modules/user/domain/enums/status.enum';

export class UserRequestDTO {

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    name: string;
    
    @IsNotEmpty()
    lastname: string;

    @IsEmail()
    email: string;

    @IsOptional()
    description: string;

    @IsNotEmpty()
    birthDate: Date;

    interests: Interest[];

    profilePicURL: string;

    @IsNumber()
    semester: number;

    freeTimeSchedule: FreeTimeSchedule[]
    
    @IsEnum(Status)
    status: Status;

    @IsEnum(Program)
    program: Program;
    
}
