import { FreeTimeSchedule } from "../../entities/free-time-schedule.entity";


export interface FreeTimeScheduleRepositoryOutPort{

    create(freeTimeSchedule: FreeTimeSchedule): Promise<FreeTimeSchedule>;

    update(id: string, freeTimeSchedule: FreeTimeSchedule): Promise<FreeTimeSchedule>;

    delete(id: string): Promise<void>;
    
    getById(id: string): Promise<FreeTimeSchedule>;

}