import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Status } from '../../../../../domain/enums/status.enum'
import { Program } from '../../../../../domain/enums/program.enum'
import { InterestSchema } from '../entities/interest.schema'
import { FreeTimeSchedule } from './free-time-schedule.schema';

export type UserDocument = HydratedDocument<UserSchema>;

@Schema()
export class UserSchema {

    @Prop()
    id: string;

    @Prop()
    username: string;

    @Prop()
    lastname: string;

    @Prop()
    email: string;

    @Prop()
    description: string;

    @Prop()
    birthDate: string;
    
    @Prop()
    interests: Array<InterestSchema>;
    
    @Prop()
    profilePicURL: string;
    
    @Prop()
    lastTimeConnected: Date;
    
    @Prop()
    semester: number;
    
    @Prop()
    isOnline: boolean;
    
    @Prop()
    isVerified: boolean;
    
    @Prop()
    createdAt: Date;
    
    @Prop()
    freeTimeSchedule: Array<FreeTimeSchedule>;
    
    @Prop()
    status: Status;
    
    @Prop()
    program: Program;
}

export const UserSchemaDefinition = SchemaFactory.createForClass(UserSchema);
