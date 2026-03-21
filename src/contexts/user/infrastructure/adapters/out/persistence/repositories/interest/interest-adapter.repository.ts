import { Interest } from "src/contexts/user/domain/entities/interest.entity";
import { InterestRepositoryOutPort } from "src/contexts/user/domain/ports/out/interest-repository-out.port";
import { InterestRepository } from "./interest.repository";
import { UserMapper } from "../../mappers/user.mapper";
import { InjectModel } from "@nestjs/mongoose";
import { InterestDocument, InterestSchema } from "../../entities/interest.schema";
import { Model } from "mongoose";


export class InterestRepositoryAdapter implements InterestRepositoryOutPort {
    
    constructor(
        private interestRepository: InterestRepository,
        private userMapper: UserMapper,
        @InjectModel(Interest.name)
        private interestModel: Model<InterestDocument>
    ){}
    
    async save(interest: Interest): Promise<Interest> {
        
        const InterestDocument: Partial<InterestSchema> = {
            name: interest.name,
            category: interest.category,
        }

        const savedInterestDocument = await this.interestModel.create(InterestDocument);
        return this.userMapper.interestToDomain(savedInterestDocument);
    }

    async update(id: string, interest: Interest): Promise<Interest> {
        
        const actualInterest = await this.interestRepository.findById(id);
        if(!actualInterest) throw new Error(`Interest with id ${id} not found`);
    
        actualInterest.name = interest.name;
        actualInterest.category = interest.category;

        const updatedDocument = this.userMapper.interestToDocument(actualInterest);
        const savedDocument = await this.interestModel.findByIdAndUpdate(id, updatedDocument, { new: true }).exec();
    
        if (!savedDocument) throw new Error(`Interest with id ${id} could not be updated`);

        return this.userMapper.interestToDomain(savedDocument);
    }

    async deleteById(id: string): Promise<void> {
        const actualInterest = await this.interestRepository.findById(id);
        if (!actualInterest) throw new Error(`Interest with id ${id} not found`);

        await this.interestRepository.deleteById(id);
        return Promise.resolve();
    }

    async findById(id: string): Promise<Interest> {
        const interest = await this.interestRepository.findById(id);
        if (!interest) throw new Error(`Interest with id ${id} not found`);

        return interest
    }
    async findAll(): Promise<Interest[]> {
        return await this.interestRepository.findAll()
    }
}