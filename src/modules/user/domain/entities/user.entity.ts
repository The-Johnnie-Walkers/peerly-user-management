import {Interest} from './interest.entity'
import { FreeTimeSchedule } from './free-time-schedule.entity'
import { Program } from '../enums/program.enum'
import { Status } from '../enums/status.enum'


export class User {
    constructor(
        public id: string,
        public username: string,
        public name: string,
        public lastname: string,
        public email: string,
        public description: string,
        public birthDate: Date,
        public interests: Interest[],
        public profilePicURL: string,
        public lastTimeConnected: Date,
        public semester: number,
        public isOnline: boolean,
        public isVerified: boolean,
        public createdAt: Date,
        public updatedAt: Date,
        public freeTimeSchedule: FreeTimeSchedule[],
        public status: Status,
        public program: Program
    ) {}
}