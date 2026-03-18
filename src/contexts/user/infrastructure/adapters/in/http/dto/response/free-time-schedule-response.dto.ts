import { DayOfTheWeek } from "src/contexts/user/domain/enums/day-of-the-week.enum";

export class FreeTimeScheduleResponseDTO {

    startsAt: Date;

    endsAt: Date;

    dayOfTheWeek: DayOfTheWeek;

}