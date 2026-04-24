import { User } from '../../../../../../domain/entities/user.entity';
import { UserRepositoryOutPort } from '../../../../../../domain/ports/out/user-repository-out.port';
import { UserRepository } from './user.repository';
import { UserMapper } from '../../mappers/user.mapper';
import { UserDocument, UserSchema } from '../../entities/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryOutPort {
  constructor(
    private userRepository: UserRepository,
    private userMapper: UserMapper,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) { }

  async save(user: User): Promise<User> {
    const UserDocument: Partial<UserSchema> & { _id?: string } = {
      ...(user.id ? { _id: user.id } : {}),
      username: user.username,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      description: user.description,
      birthDate: user.birthDate,
      interests:
        user.interests
          ?.filter((i) => mongoose.isValidObjectId(i.id))
          .map((i) => new mongoose.Types.ObjectId(i.id)) ?? [],
      profilePicURL: user.profilePicURL,
      lastTimeConnected: user.lastTimeConnected,
      semester: user.semester,
      isOnline: user.isOnline,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      freeTimeSchedule: user.freeTimeSchedule
        ? user.freeTimeSchedule.map((ft) => this.userMapper.freeTimeScheduleToDocument(ft)) as any
        : [],
      status: user.status,
      programs: user.programs,
      role: user.role,
    };

    const savedUserDocument = await this.userModel.create(UserDocument);
    return this.userMapper.toDomain(savedUserDocument);
  }

  async update(id: string, user: User): Promise<User> {
    const actualUser = await this.userRepository.findById(id);
    if (!actualUser) throw new NotFoundException(`User with id ${id} not found`);

    actualUser.username = user.username;
    actualUser.name = user.name;
    actualUser.lastname = user.lastname;
    actualUser.email = user.email;
    actualUser.description = user.description;
    actualUser.birthDate = user.birthDate;
    actualUser.interests = user.interests;
    actualUser.profilePicURL = user.profilePicURL;
    actualUser.lastTimeConnected = user.lastTimeConnected;
    actualUser.semester = user.semester;
    actualUser.isOnline = user.isOnline;
    actualUser.isVerified = user.isVerified;
    actualUser.createdAt = user.createdAt;
    actualUser.updatedAt = user.updatedAt;
    actualUser.freeTimeSchedule = user.freeTimeSchedule;
    actualUser.status = user.status;
    actualUser.programs = user.programs;
    actualUser.role = user.role;

    const updatedDocument = this.userMapper.toDocument(actualUser);
    const savedDocument = await this.userModel
      .findByIdAndUpdate(id, updatedDocument, { returnDocument: 'after' })
      .populate('interests')
      .exec();

    if (!savedDocument)
      throw new NotFoundException(`User with id ${id} could not be updated`);

    return this.userMapper.toDomain(savedDocument);
  }

  async deleteById(id: string): Promise<void> {
    const actualUser = await this.userRepository.findById(id);
    if (!actualUser) throw new NotFoundException(`User with id ${id} not found`);

    await this.userRepository.deleteById(id);
    return Promise.resolve();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
