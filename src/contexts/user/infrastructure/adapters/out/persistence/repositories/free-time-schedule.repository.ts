import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FreeTimeSchedule } from "src/contexts/user/domain/entities/free-time-schedule.entity";
import { UserMapper } from "../mappers/user.mapper";
import { freeTimeScheduleDocument } from "../entities/free-time-schedule.schema";

@Injectable()
export class FreeTimeScheduleRepository {
    constructor(
        @InjectModel(FreeTimeSchedule.name) private freeTimeScheduleModel: Model<freeTimeScheduleDocument>,
        private userMapper: UserMapper
    ) { }

    async findById(freeTimeScheduleId: string): Promise<FreeTimeSchedule | null> {
        const document = await this.freeTimeScheduleModel.findById(freeTimeScheduleId).exec();
        return document ? this.userMapper.freeTimeScheduleToDomain(document) : null;
    }

    async deleteById(freeTimeScheduleId: string): Promise<boolean> {
        const result = await this.freeTimeScheduleModel.findByIdAndDelete(freeTimeScheduleId).exec();
        return result != null ? true : false;
    }
}