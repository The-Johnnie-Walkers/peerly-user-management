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

    async createFreeTimeSchedule(freeTimeSchedule: FreeTimeSchedule): Promise<FreeTimeSchedule> {
        return await this.freeTimeScheduleRepositoryOutPort.create(freeTimeSchedule);
    }

    async updateFreeTimeSchedule(id: string, freeTimeSchedule: FreeTimeSchedule): Promise<FreeTimeSchedule> {
        return await this.freeTimeScheduleRepositoryOutPort.update(id, freeTimeSchedule);
    }

    async deleteFreeTimeScheduleById(id: string): Promise<void> {
        await this.freeTimeScheduleRepositoryOutPort.delete(id);
    }

    async getFreeTimeScheduleById(id: string): Promise<FreeTimeSchedule> {
        return await this.getFreeTimeScheduleById(id);
    }
}