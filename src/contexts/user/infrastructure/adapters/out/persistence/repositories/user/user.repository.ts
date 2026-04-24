import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../../../../domain/entities/user.entity';
import { UserDocument } from '../../entities/user.schema';
import { UserMapper } from '../../mappers/user.mapper';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userMapper: UserMapper,
  ) { }

  async findAll(): Promise<User[]> {
    const documents = await this.userModel.find().populate('interests').exec();
    return documents.map((doc) => this.userMapper.toDomain(doc));
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const document = await this.userModel
      .findOne({ email: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') })
      .populate('interests')
      .exec();
    return document ? this.userMapper.toDomain(document) : null;
  }

  async findById(userId: string): Promise<User | null> {
    if (!isValidObjectId(userId)) return null;
    const document = await this.userModel.findById(userId).populate('interests').exec();
    return document ? this.userMapper.toDomain(document) : null;
  }

  async deleteById(userId: string): Promise<boolean> {
    if (!isValidObjectId(userId)) return false;
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    return result != null ? true : false;
  }
}
