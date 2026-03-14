import { User } from "src/modules/user/domain/entities/user.entity";
import { UserDocument, UserSchema } from "../entities/user.schema";
import { InterestDocument, InterestSchema } from "../entities/interest.schema";
import { Interest } from "src/modules/user/domain/entities/interest.entity";
import mongoose from "mongoose";
import { FreeTimeSchedule } from "src/modules/user/domain/entities/free-time-schedule.entity";
import { FreeTimeScheduleSchema } from "../entities/free-time-schedule.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserMapper{

    toDomain(document: UserDocument): User{
        return new User(
            document._id.toString(),
            document.username,
            document.name,
            document.lastname,
            document.email,
            document.description,
            document.birthDate,
            document.interests as any,
            document.profilePicURL,
            document.lastTimeConnected,
            document.semester,
            document.isOnline,
            document.isVerified,
            document.createdAt,
            document.updatedAt,
            document.freeTimeSchedule?.map(freetimeSchedule => this.freeTimeScheduleToDomain(freetimeSchedule)),
            document.status,
            document.program
        );
    }

    toDocument(entity: User): Partial<UserSchema> {
        return {
            username: entity.username,
            name: entity.name,
            lastname: entity.lastname,
            email: entity.email,
            description: entity.description,
            birthDate: entity.birthDate,
            interests: entity.interests as any,
            profilePicURL: entity.profilePicURL,
            lastTimeConnected: entity.lastTimeConnected,
            semester: entity.semester,
            isOnline: entity.isOnline,
            isVerified: entity.isVerified,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            freeTimeSchedule: entity.freeTimeSchedule.map(freeTimeSchedule => this.freeTimeScheduleToDocument(freeTimeSchedule)),
            status: entity.status,
            program: entity.program
        } 
    }

    interestToDomain(interestDocument: InterestDocument): Interest {
        return new Interest(
            interestDocument._id.toString(),
            interestDocument.name,
            interestDocument.category,
            interestDocument.users as any
        );
    }

    interestToDocument(interestEntity: Interest, usersIds?: string[]): Partial<InterestSchema> {
        return {
            name: interestEntity.name,
            category: interestEntity.category,
            users: usersIds?.map(id => new mongoose.Types.ObjectId(id)) || []
        } 
    }

    freeTimeScheduleToDomain(freeTimeScheduleDocument: FreeTimeScheduleSchema): FreeTimeSchedule {
        return new FreeTimeSchedule(
            freeTimeScheduleDocument.startsAt,
            freeTimeScheduleDocument.endsAt,
            freeTimeScheduleDocument.dayOfTheWeek
        );
    }

    freeTimeScheduleToDocument(freeTimeScheduleEntity: FreeTimeSchedule): FreeTimeScheduleSchema {
        return {
            startsAt: freeTimeScheduleEntity.startsAt,
            endsAt: freeTimeScheduleEntity.endsAt,
            dayOfTheWeek: freeTimeScheduleEntity.dayOfTheWeek
        }
    }

}