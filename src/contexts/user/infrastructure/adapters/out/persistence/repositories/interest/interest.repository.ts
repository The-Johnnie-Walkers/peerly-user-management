import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Interest } from 'src/contexts/user/domain/entities/interest.entity';
import { InterestDocument } from '../../entities/interest.schema';
import { UserMapper } from '../../mappers/user.mapper';
import { Model } from 'mongoose';
import { Category } from 'src/contexts/user/domain/enums/category.enum';

@Injectable()
export class InterestRepository {
  constructor(
    @InjectModel(Interest.name) private interestModel: Model<InterestDocument>,
    private userMapper: UserMapper,
  ) {}

  async findAll(): Promise<Interest[]> {
    const documents = await this.interestModel.find().exec();
    return documents.map((document) =>
      this.userMapper.interestToDomain(document),
    );
  }

  async findById(id: string): Promise<Interest | null> {
    const document = await this.interestModel.findById(id).exec();
    return document ? this.userMapper.interestToDomain(document) : null;
  }

  async findByName(name: string): Promise<Interest | null> {
    const document = await this.interestModel.findOne({ name }).exec();
    return document ? this.userMapper.interestToDomain(document) : null;
  }

  async findByCategory(category: Category): Promise<Interest[]> {
    const documents = await this.interestModel.find({ category }).exec();
    return documents
      ? documents.map((document) => this.userMapper.interestToDomain(document))
      : [];
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.interestModel.findByIdAndDelete(id).exec();
    return result != null ? true : false;
  }
}
