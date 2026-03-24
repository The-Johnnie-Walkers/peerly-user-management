import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { FreeTimeSchedule } from 'src/contexts/user/domain/entities/free-time-schedule.entity';
import { Interest } from 'src/contexts/user/domain/entities/interest.entity';
import { Program } from 'src/contexts/user/domain/enums/program.enum';
import { Status } from 'src/contexts/user/domain/enums/status.enum';
import { UserRole } from 'src/contexts/user/domain/enums/user-role.enum';

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

  @IsOptional()
  interests: Interest[];

  @IsOptional()
  profilePicURL: string;

  @IsNumber()
  semester: number;

  @IsOptional()
  freeTimeSchedule: FreeTimeSchedule[];

  @IsEnum(Status)
  status: Status;

  @IsEnum(Program, { each: true })
  programs: Program[];

  @IsEnum(UserRole)
  role: UserRole;
}
