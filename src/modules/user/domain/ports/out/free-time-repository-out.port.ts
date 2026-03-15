import { FreeTimeSchedule } from "../../entities/free-time-schedule.entity";


export interface FreeTimeScheduleRepositoryOutPort{

    create(freeTimeSchedule: FreeTimeSchedule): FreeTimeSchedule;

    update(id: string, freeTimeSchedule: FreeTimeSchedule): FreeTimeSchedule;

    delete(id: string): void;
    
    getById(id: string): FreeTimeSchedule;

}