import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DayOfTheWeek } from "src/modules/user/domain/enums/day-of-the-week.enum";

@Schema()
export class FreeTimeScheduleSchema{

    @Prop({ required: true})
    startsAt: Date;

    @Prop({ required: true})
    endsAt: Date;

    @Prop({ required: true})
    dayOfTheWeek: DayOfTheWeek;
}

export const FreeTimeScheduleDefinition = SchemaFactory.createForClass(FreeTimeScheduleSchema);