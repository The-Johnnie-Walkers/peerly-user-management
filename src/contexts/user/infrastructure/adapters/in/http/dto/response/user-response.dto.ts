import { FreeTimeSchedule } from '../../../../../../domain/entities/free-time-schedule.entity';
import { Interest } from '../../../../../../domain/entities/interest.entity';
import { Program } from '../../../../../../domain/enums/program.enum';
import { Status } from '../../../../../../domain/enums/status.enum';

export class UserResponseDTO {
  id: string;

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

  freeTimeSchedule?: FreeTimeSchedule[];

  status: Status;

  programs: Program[];

  role: string;
}
