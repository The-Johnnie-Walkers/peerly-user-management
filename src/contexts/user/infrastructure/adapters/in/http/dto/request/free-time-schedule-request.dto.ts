import { IsDate, IsEnum, IsNotEmpty } from "class-validator";
import { DayOfTheWeek } from "src/contexts/user/domain/enums/day-of-the-week.enum";

export class FreeTimeScheduleRequestDTO {

    @IsDate()
    @IsNotEmpty()
    startsAt: Date;

    @IsDate()
    @IsNotEmpty()
    endsAt: Date;

    @IsNotEmpty()
    @IsEnum(DayOfTheWeek)
    dayOfTheWeek: DayOfTheWeek;

}