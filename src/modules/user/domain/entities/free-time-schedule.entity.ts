import { DayOfTheWeek } from '../enums/day-of-the-week.enum'

export class FreeTimeSchedule {
    constructor(
        public startsAt: Date,
        public endsAt: Date,
        public dayOfTheWeek: DayOfTheWeek
    ) {}    
}
