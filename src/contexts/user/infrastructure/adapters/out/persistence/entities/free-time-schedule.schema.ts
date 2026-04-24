import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DayOfTheWeek } from '../../../../../domain/enums/day-of-the-week.enum';

export type FreeTimeScheduleDocument = HydratedDocument<FreeTimeScheduleSchema>;

@Schema()
export class FreeTimeScheduleSchema {
  @Prop({ required: true })
  startsAt!: Date;

  @Prop({ required: true })
  endsAt!: Date;

  @Prop({ required: true })
  dayOfTheWeek!: DayOfTheWeek;
}

export const FreeTimeScheduleDefinition = SchemaFactory.createForClass(
  FreeTimeScheduleSchema,
);
