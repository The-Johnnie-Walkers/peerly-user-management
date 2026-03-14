import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/modules/user/domain/entities/user.entity";
import { UserDocument, UserSchema } from "../entities/user.schema";
import { UserMapper } from "../mappers/user.mapper";
import { Model } from "mongoose";

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private userMapper: UserMapper
    ) {}

    async findAll(): Promise<User[]> {
        const documents = await this.userModel.find().populate('Interest').exec();
        return documents.map(doc => this.userMapper.toDomain(doc));
    }

    async findByEmail(email: string ): Promise<User | null> {
        const document = await this.userModel.findOne({email}).populate('Interest').exec();
        return document ? this.userMapper.toDomain(document) : null;
    }

    async findById(userId: string): Promise<User | null> {
        const document = await this.userModel.findById(userId).populate('Interest').exec();
        return document ? this.userMapper.toDomain(document) : null;
    }

    async deleteById(userId: string): Promise<boolean> {
        const result = await this.userModel.findByIdAndDelete(userId).exec();
        return result != null  ? true : false;
    }
f
}