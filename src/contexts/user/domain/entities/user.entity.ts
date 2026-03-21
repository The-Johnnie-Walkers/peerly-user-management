import { Interest } from './interest.entity';
import { FreeTimeSchedule } from './free-time-schedule.entity';
import { Program } from '../enums/program.enum';
import { Status } from '../enums/status.enum';
import { UserRole } from '../enums/user-role.enum';

export interface UserProps {
  id: string;
  username: string;
  name: string;
  lastname: string;
  email: string;
  description?: string;
  birthDate: Date;
  interests?: Interest[];
  profilePicURL?: string;
  lastTimeConnected?: Date;
  semester: number;
  isOnline: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  freeTimeSchedule?: FreeTimeSchedule[];
  status: Status;
  programs: Program[];
  role: UserRole;
}

export class User {
  constructor(private props: UserProps) {}

  get id(): string {
    return this.props.id;
  }
  set id(id: string) {
    this.props.id = id;
  }
  get username(): string {
    return this.props.username;
  }
  set username(username: string) {
    this.props.username = username;
  }
  get name(): string {
    return this.props.name;
  }
  set name(name: string) {
    this.props.name = name;
  }
  get lastname(): string {
    return this.props.lastname;
  }
  set lastname(lastname: string) {
    this.props.lastname = lastname;
  }
  get email(): string {
    return this.props.email;
  }
  set email(email: string) {
    this.props.email = email;
  }
  get description(): string | undefined {
    return this.props.description;
  }
  set description(description: string | undefined) {
    this.props.description = description ?? '';
  }
  get birthDate(): Date {
    return this.props.birthDate;
  }
  set birthDate(birthDate: Date) {
    this.props.birthDate = birthDate;
  }
  get interests(): Interest[] | undefined {
    return this.props.interests;
  }
  set interests(interests: Interest[] | undefined) {
    this.props.interests = interests ?? [];
  }
  get profilePicURL(): string | undefined {
    return this.props.profilePicURL ?? '';
  }
  set profilePicURL(profilePicURL: string | undefined) {
    this.props.profilePicURL = profilePicURL ?? '';
  }
  get lastTimeConnected(): Date | undefined {
    return this.props.lastTimeConnected;
  }
  set lastTimeConnected(lastTimeConnected: Date | undefined) {
    this.props.lastTimeConnected = lastTimeConnected;
  }
  get semester(): number {
    return this.props.semester;
  }
  set semester(semester: number) {
    this.props.semester = semester;
  }
  get isOnline(): boolean {
    return this.props.isOnline;
  }
  set isOnline(isOnline: boolean) {
    this.props.isOnline = isOnline;
  }
  get isVerified(): boolean {
    return this.props.isVerified;
  }
  set isVerified(isVerified: boolean) {
    this.props.isVerified = isVerified;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
  get freeTimeSchedule(): FreeTimeSchedule[] | undefined {
    return this.props.freeTimeSchedule;
  }
  set freeTimeSchedule(freeTimeSchedule: FreeTimeSchedule[] | undefined) {
    this.props.freeTimeSchedule = freeTimeSchedule ?? [];
  }
  get status(): Status {
    return this.props.status;
  }
  set status(status: Status) {
    this.props.status = status;
  }
  get programs(): Program[] {
    return this.props.programs;
  }
  set programs(programs: Program[]) {
    this.props.programs = programs;
  }
  get role(): UserRole {
    return this.props.role;
  }
  set role(role: UserRole) {
    this.props.role = role;
  }

  validateAge() {
    const age = new Date().getFullYear() - this.props.birthDate.getFullYear();

    if (age < 18) {
      throw new Error('User must be at least 18 years old');
    }
  }

  addInterest(newInterest: Interest): void {
    if (!this.props.interests) this.props.interests = [];

    if (this.props.interests.length >= 5) {
      throw new Error('User can only have a maximum of 5 interests');
    }

    this.props.interests.push(newInterest);
  }

  removeInterest(interestToDelete: Interest): void {
    if (!this.props.interests || this.props.interests == null) {
      throw new Error('The user dont have interests');
    }

    const interest = this.props.interests.find(
      (interest) => interest.id === interestToDelete.id,
    );
    if (!interest) {
      throw new Error('Interest not found');
    }
    this.props.interests.splice(this.props.interests.indexOf(interest), 1);
  }

  addFreeTimeSchedule(newFreeTimeSchedule: FreeTimeSchedule): void {
    if (!this.props.freeTimeSchedule) this.props.freeTimeSchedule = [];
    if (
      this.props.freeTimeSchedule.some(
        (ft) =>
          ft.dayOfTheWeek == newFreeTimeSchedule.dayOfTheWeek &&
          newFreeTimeSchedule.startsAt.getTime() < ft.endsAt.getTime() &&
          newFreeTimeSchedule.endsAt.getTime() > ft.startsAt.getTime(),
      )
    ) {
      throw new Error('Free time choosed, overlaps with an existant one');
    }

    this.props.freeTimeSchedule.push(newFreeTimeSchedule);
  }

  updateFreeTimeSchedule(freeTimeScheduleToUpdate: FreeTimeSchedule): void {
    if (!this.props.freeTimeSchedule || this.props.freeTimeSchedule == null) {
      throw new Error('The user dont have free time schedules');
    }

    const freeTimeSchedule = this.props.freeTimeSchedule.find(
      (freeTimeSchedule) => freeTimeSchedule.id === freeTimeScheduleToUpdate.id,
    );

    if (!freeTimeSchedule) {
      throw new Error('Free time schedule not found');
    }

    if (freeTimeScheduleToUpdate.startsAt >= freeTimeScheduleToUpdate.endsAt) {
      throw new Error('Invalid free time schedule');
    }

    if (
      this.props.freeTimeSchedule.some(
        (ft) =>
          ft.dayOfTheWeek == freeTimeScheduleToUpdate.dayOfTheWeek &&
          freeTimeSchedule.startsAt.getTime() < ft.endsAt.getTime() &&
          freeTimeSchedule.endsAt.getTime() > ft.startsAt.getTime(),
      )
    ) {
      throw new Error('Free time choosed, overlaps with an existant one');
    }

    freeTimeSchedule.startsAt = freeTimeScheduleToUpdate.startsAt;
    freeTimeSchedule.endsAt = freeTimeScheduleToUpdate.endsAt;
    freeTimeSchedule.dayOfTheWeek = freeTimeScheduleToUpdate.dayOfTheWeek;
  }

  removeFreeTimeSchedule(freeTimeScheduleToDelete: FreeTimeSchedule): void {
    if (
      !this.props.freeTimeSchedule ||
      this.props.freeTimeSchedule.length == 0
    ) {
      throw new Error('The user dont have free time schedules');
    }

    const freeTimeSchedule = this.props.freeTimeSchedule.find(
      (freeTimeSchedule) => freeTimeSchedule.id === freeTimeScheduleToDelete.id,
    );
    if (!freeTimeSchedule) {
      throw new Error('Free time schedule not found');
    }
    this.props.freeTimeSchedule.splice(
      this.props.freeTimeSchedule.indexOf(freeTimeSchedule),
      1,
    );
  }

  addProgram(newProgram: Program): void {
    if (this.props.programs.length >= 2)
      throw new Error('The user only can have maximum 2 programs');
    if (!this.props.programs) this.props.programs = [];
    if (this.props.programs.find((program) => program === newProgram))
      throw new Error('The user already have the program');

    this.props.programs.push(newProgram);
  }

  deleteProgram(deletedProgram: Program): void {
    if (!this.props.programs || this.props.programs.length == 0)
      throw Error('The user dont have programs');

    const program = this.props.programs.find((p) => p === deletedProgram);

    if (!program) throw new Error('Program not found');

    this.props.programs.splice(this.props.programs.indexOf(program), 1);
  }
}
