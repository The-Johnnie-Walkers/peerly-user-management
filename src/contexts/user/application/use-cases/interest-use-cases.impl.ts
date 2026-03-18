import { InjectModel } from "@nestjs/mongoose";
import { InterestRepositoryOutPort } from "../../domain/ports/out/interest-repository-out.port";
import { InterestRepository } from "../../infrastructure/adapters/out/persistence/repositories/interest.repository";
import { InterestDocument, InterestSchema } from "../../infrastructure/adapters/out/persistence/entities/interest.schema";
import { Interest } from "../../domain/entities/interest.entity";
import { Model } from "mongoose";
import { UserMapper } from "../../infrastructure/adapters/out/persistence/mappers/user.mapper";

export class InterestUseCasesImpl implements InterestRepositoryOutPort {

    constructor(
        private interestRepository: InterestRepository,
        private userMapper: UserMapper,
        @InjectModel(Interest.name)
        private interestModel: Model<InterestDocument>
    ) { }


    async create(interest: Interest): Promise<Interest> {
        const interestDocument: Partial<InterestSchema> = {
            name: interest.name,
            category: interest.category,
            users: interest.users as any
        }

        const savedDocument = await this.interestModel.create(interestDocument);

        return this.userMapper.interestToDomain(savedDocument);
    }

    async update(id: string, interest: Interest): Promise<Interest> {

        const actualInterest = await this.interestRepository.findById(id);

        if (!actualInterest) throw new Error('The interest with id ${id} not found');

        actualInterest.name = interest.name;
        actualInterest.category = interest.category;
        actualInterest.users = interest.users;

        const updatedDocument = this.userMapper.interestToDocument(actualInterest);
        const savedDocument = await this.interestModel.findByIdAndUpdate(id, updatedDocument, { new: true }).exec();

        if (!savedDocument) {
            throw new Error('The update was not succesful')
        }

        return this.userMapper.interestToDomain(savedDocument);
    }

    async deleteById(id: string): Promise<void> {
        const actualInterest = await this.interestRepository.findById(id);

        if (!actualInterest) throw new Error('The interest with id ${id} not found');

        await this.interestModel.findByIdAndDelete(id);
        return Promise.resolve();
    }

    async getById(id: string): Promise<Interest> {

        const actualInterest = await this.interestRepository.findById(id);

        if (!actualInterest) throw new Error('The interest with id ${id} not found');

        return actualInterest;

    }

    async getAll(): Promise<Interest[]> {

        return await this.interestRepository.findAll()

    }
}