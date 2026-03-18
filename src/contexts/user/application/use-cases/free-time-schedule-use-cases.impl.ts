import { InjectModel } from "@nestjs/mongoose";
import { FreeTimeSchedule } from "../../domain/entities/free-time-schedule.entity";
import { FreeTimeScheduleRepositoryOutPort } from "../../domain/ports/out/free-time-repository-out.port";
import { UserMapper } from "../../infrastructure/adapters/out/persistence/mappers/user.mapper";
import { Model } from "mongoose";
import { freeTimeScheduleDocument, FreeTimeScheduleSchema } from "../../infrastructure/adapters/out/persistence/entities/free-time-schedule.schema";
import { FreeTimeScheduleRepository } from "../../infrastructure/adapters/out/persistence/repositories/free-time-schedule.repository";


export class FreeTimeScheduleUseCasesImpl implements FreeTimeScheduleRepositoryOutPort {

    constructor(
        private freeTimeScheduleRepository: FreeTimeScheduleRepository,
        private userMapper: UserMapper,
        @InjectModel(FreeTimeSchedule.name)
        private freeTimeScheduleModel: Model<freeTimeScheduleDocument>
    ) { }

    async create(freeTimeSchedule: FreeTimeSchedule): Promise<FreeTimeSchedule> {
        const freeTimeScheduleDocument: Partial<FreeTimeScheduleSchema> = {
            startsAt: freeTimeSchedule.startsAt,
            endsAt: freeTimeSchedule.endsAt,
            dayOfTheWeek: freeTimeSchedule.dayOfTheWeek
        }

        const savedDocument = await this.freeTimeScheduleModel.create(freeTimeScheduleDocument);

        return this.userMapper.freeTimeScheduleToDomain(savedDocument);
    }

    async update(id: string, freeTimeSchedule: FreeTimeSchedule): Promise<FreeTimeSchedule> {

        const actualFreeTime = await this.freeTimeScheduleRepository.findById(id);

        if (!actualFreeTime) throw new Error('The free time with id ${id} was not found');

        actualFreeTime.startsAt = freeTimeSchedule.startsAt;
        actualFreeTime.endsAt = freeTimeSchedule.endsAt;
        actualFreeTime.dayOfTheWeek = freeTimeSchedule.dayOfTheWeek;

        const updatedDocument = this.userMapper.freeTimeScheduleToDocument(actualFreeTime);
        const savedDocument = await this.freeTimeScheduleModel.findByIdAndUpdate(id, updatedDocument, { new: true }).exec();


        if (!savedDocument) {
            throw new Error('The update was not succesful')
        }

        return this.userMapper.freeTimeScheduleToDomain(savedDocument);
    }

    async delete(id: string): Promise<void> {
        const actualFreeTime = await this.freeTimeScheduleRepository.findById(id);

        if (!actualFreeTime) throw new Error('The free time with id ${id} was not found');

        await this.freeTimeScheduleModel.findByIdAndDelete(id);
        return Promise.resolve();

    }

    async getById(id: string): Promise<FreeTimeSchedule> {

        const actualFreeTime = await this.freeTimeScheduleRepository.findById(id);

        if (!actualFreeTime) throw new Error('The free time with id ${id} was not found');

        return actualFreeTime;
    }



}