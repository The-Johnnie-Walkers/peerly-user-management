import { DayOfTheWeek } from '../enums/day-of-the-week.enum';

export interface FreeTimeScheduleProps {
  id: string;
  startsAt: Date;
  endsAt: Date;
  dayOfTheWeek: DayOfTheWeek;
}

export class FreeTimeSchedule {
  constructor(private props: FreeTimeScheduleProps) {}

  get id(): string {
    return this.props.id;
  }

  get startsAt(): Date {
    return this.props.startsAt;
  }

  get endsAt(): Date {
    return this.props.endsAt;
  }

  get dayOfTheWeek(): DayOfTheWeek {
    return this.props.dayOfTheWeek;
  }

  set startsAt(startsAt: Date) {
    this.props.startsAt = startsAt;
  }

  set endsAt(endsAt: Date) {
    this.props.endsAt = endsAt;
  }

  set dayOfTheWeek(dayOfTheWeek: DayOfTheWeek) {
    this.props.dayOfTheWeek = dayOfTheWeek;
  }
}
