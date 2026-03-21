import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Status } from '../../../../../domain/enums/status.enum';
import { Program } from '../../../../../domain/enums/program.enum';
import { FreeTimeScheduleSchema } from './free-time-schedule.schema';
import * as mongoose from 'mongoose';
import { UserRole } from 'src/contexts/user/domain/enums/user-role.enum';

export type UserDocument = HydratedDocument<UserSchema>;

@Schema()
export class UserSchema {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
    default: [],
  })
  interests: mongoose.Types.ObjectId[];

  @Prop()
  profilePicURL: string;

  @Prop()
  lastTimeConnected: Date;

  @Prop({ required: true })
  semester: number;

  @Prop({ required: true })
  isOnline: boolean;

  @Prop({ required: true })
  isVerified: boolean;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ type: [FreeTimeScheduleSchema], default: [] })
  freeTimeSchedule: FreeTimeScheduleSchema[];

  @Prop({ required: true })
  status: Status;

  @Prop({ required: true })
  programs: Program[];

  @Prop({ required: true })
  role: UserRole;
}

export const UserSchemaDefinition = SchemaFactory.createForClass(UserSchema);
