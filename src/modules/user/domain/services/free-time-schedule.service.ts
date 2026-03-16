import { FreeTimeSchedule } from "../entities/free-time-schedule.entity";
import { CreateFreeTimeScheduleUseCase } from "../ports/in/create-free-time-use-case.port";
import { DeleteFreeTimeScheduleUseCase } from "../ports/in/delete-free-time-use-case.port";
import { GetFreeTimeScheduleUseCase } from "../ports/in/get-free-time-use-case.port";
import { UpdateFreeTimeScheduleUseCase } from "../ports/in/update-free-time-use-case.port";
import { FreeTimeScheduleRepositoryOutPort } from "../ports/out/free-time-repository-out.port";


export class FreeTimeScheduleService implements CreateFreeTimeScheduleUseCase, UpdateFreeTimeScheduleUseCase, DeleteFreeTimeScheduleUseCase, GetFreeTimeScheduleUseCase {

    constructor(
        private freeTimeScheduleRepositoryOutPort: FreeTimeScheduleRepositoryOutPort
    ) {}

    createFreeTimeSchedule(freeTimeSchedule: FreeTimeSchedule): Promise<FreeTimeSchedule> {
        return this.freeTimeScheduleRepositoryOutPort.create(freeTimeSchedule);
    }

    updateFreeTimeSchedule(id: string, freeTimeSchedule: FreeTimeSchedule): Promise<FreeTimeSchedule> {
        return this.freeTimeScheduleRepositoryOutPort.update(id, freeTimeSchedule);
    }

    deleteFreeTimeScheduleById(id: string): void {
        this.freeTimeScheduleRepositoryOutPort.delete(id);
    }

    getFreeTimeScheduleById(id: string): Promise<FreeTimeSchedule> {
        return this.getFreeTimeScheduleById(id);
    }
}