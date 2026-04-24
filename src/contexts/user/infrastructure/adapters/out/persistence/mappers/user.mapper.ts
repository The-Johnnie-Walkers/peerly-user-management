import { User } from '../../../../../domain/entities/user.entity';
import { UserDocument, UserSchema } from '../entities/user.schema';
import { InterestDocument, InterestSchema } from '../entities/interest.schema';
import { FreeTimeScheduleDocument, FreeTimeScheduleSchema } from '../entities/free-time-schedule.schema';
import { Interest } from '../../../../../domain/entities/interest.entity';
import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { FreeTimeSchedule } from '../../../../../domain/entities/free-time-schedule.entity';

@Injectable()
export class UserMapper {
  toDomain(document: UserDocument): User {
    return new User({
      id: document._id.toString(),
      username: document.username,
      name: document.name,
      lastname: document.lastname,
      email: document.email,
      description: document.description,
      birthDate: document.birthDate,
      interests: document.interests ? (document.interests as unknown as InterestDocument[]).map((interest) => this.interestToDomain(interest)): undefined,
      profilePicURL: document.profilePicURL,
      lastTimeConnected: document.lastTimeConnected,
      semester: document.semester,
      isOnline: document.isOnline,
      isVerified: document.isVerified,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      freeTimeSchedule: document.freeTimeSchedule? (document.freeTimeSchedule as unknown as FreeTimeScheduleDocument[]).map((freeTimeSchedule) => this.freeTimeScheduleToDomain(freeTimeSchedule)) : undefined,
      status: document.status,
      programs: document.programs,
      role: document.role,
    });
  }

  toDocument(entity: User): Partial<UserSchema> {
    return {
      username: entity.username,
      name: entity.name,
      lastname: entity.lastname,
      email: entity.email,
      description: entity.description,
      birthDate: entity.birthDate,
      interests: entity.interests? entity.interests.map((interest) => new mongoose.Types.ObjectId(interest.id),): undefined,
      profilePicURL: entity.profilePicURL,
      lastTimeConnected: entity.lastTimeConnected,
      semester: entity.semester,
      isOnline: entity.isOnline,
      isVerified: entity.isVerified,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      freeTimeSchedule: entity.freeTimeSchedule,
      status: entity.status,
      programs: entity.programs,
      role: entity.role,
    };
  }

  interestToDomain(interestDocument: InterestDocument): Interest {
    return new Interest({
      id: interestDocument._id.toString(),
      name: interestDocument.name,
      category: interestDocument.category,
    });
  }

  interestToDocument(interestEntity: Interest): Partial<InterestSchema> {
    return {
      name: interestEntity.name,
      category: interestEntity.category,
    };
  }

  freeTimeScheduleToDomain(
    freeTimeScheduleDocument: FreeTimeScheduleDocument): FreeTimeSchedule {
    return new FreeTimeSchedule({
      id: freeTimeScheduleDocument._id.toString(),
      startsAt: freeTimeScheduleDocument.startsAt,
      endsAt: freeTimeScheduleDocument.endsAt,
      dayOfTheWeek: freeTimeScheduleDocument.dayOfTheWeek,
    });
  }

  freeTimeScheduleToDocument(
    freeTimeScheduleEntity: FreeTimeSchedule): Partial<FreeTimeScheduleSchema> {
    return {
      startsAt: freeTimeScheduleEntity.startsAt,
      endsAt: freeTimeScheduleEntity.endsAt,
      dayOfTheWeek: freeTimeScheduleEntity.dayOfTheWeek,
    };
  }
}
