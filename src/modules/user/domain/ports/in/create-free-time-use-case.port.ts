import { FreeTimeSchedule } from "../../entities/free-time-schedule.entity";


export interface CreateFreeTimeScheduleUseCase {

    createFreeTimeSchedule(freeTimeSchedule: FreeTimeSchedule): Promise<FreeTimeSchedule>;

}