import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DayOfTheWeek } from "src/contexts/user/domain/enums/day-of-the-week.enum";

export type freeTimeScheduleDocument = HydratedDocument<FreeTimeScheduleSchema>

@Schema()
export class FreeTimeScheduleSchema {

    @Prop({ required: true })
    startsAt: Date;

    @Prop({ required: true })
    endsAt: Date;

    @Prop({ required: true })
    dayOfTheWeek: DayOfTheWeek;
}

export const FreeTimeScheduleDefinition = SchemaFactory.createForClass(FreeTimeScheduleSchema);