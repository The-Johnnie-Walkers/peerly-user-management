import { FreeTimeSchedule } from "../../entities/free-time-schedule.entity";

export interface UpdateFreeTimeScheduleUseCase {

    updateFreeTimeSchedule(id: string, freeTimeSchedule: FreeTimeSchedule): FreeTimeSchedule;

}