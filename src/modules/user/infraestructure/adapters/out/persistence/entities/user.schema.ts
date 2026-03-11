import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Status } from '../../../../../domain/enums/status.enum'
import { Program } from '../../../../../domain/enums/program.enum'
import { FreeTimeScheduleSchema } from './free-time-schedule.schema';
import * as mongoose from 'mongoose';

export type UserDocument = HydratedDocument<UserSchema>;

@Schema({ timestamps: true})
export class UserSchema {

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    lastname: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    description?: string;

    @Prop({ required: true })
    birthDate: Date;
    
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interests' }], default: []})
    interests: Array<mongoose.Types.ObjectId>;
    
    @Prop()
    profilePicURL?: string;
    
    @Prop()
    lastTimeConnected?: Date;
    
    @Prop({ required: true })
    semester: number;
    
    @Prop({ required: false })
    isOnline: boolean;
    
    @Prop({ required: false })
    isVerified: boolean;
    
    @Prop({ type: [FreeTimeScheduleSchema], default: [] })
    freeTimeSchedule: Array<FreeTimeScheduleSchema>;
    
    @Prop({ required: true })
    status: Status;
    
    @Prop({ required: true })
    program: Program;
}

export const UserSchemaDefinition = SchemaFactory.createForClass(UserSchema);
