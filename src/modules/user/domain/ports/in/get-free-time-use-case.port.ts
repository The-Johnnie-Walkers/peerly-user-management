import { FreeTimeSchedule } from "../../entities/free-time-schedule.entity";

export interface GetFreeTimeScheduleUseCase{

    getFreeTimeScheduleById(id: string): FreeTimeSchedule;

}