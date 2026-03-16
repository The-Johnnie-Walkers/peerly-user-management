import { Interest } from "../entities/interest.entity";
import { CreateInterestUseCase } from "../ports/in/create-interest-use-case.port";
import { DeleteInterestUseCase } from "../ports/in/delete-interest-use-case.port";
import { GetAllInterestsUseCase } from "../ports/in/get-all-interests-use-case.port";
import { GetInterestUseCase } from "../ports/in/get-interest-use.case.port";
import { UpdateInterestUseCase } from "../ports/in/update-interest-use-case.port";
import { InterestRepositoryOutPort } from "../ports/out/interest-repository-out.port";

export class InterestService implements CreateInterestUseCase, UpdateInterestUseCase, DeleteInterestUseCase, GetInterestUseCase, GetAllInterestsUseCase{

    constructor(
        private interestRepositoryOutPort: InterestRepositoryOutPort
    ){}

    async createInterest(interest: Interest): Promise<Interest> {
        return await this.interestRepositoryOutPort.create(interest);
    }

    async updateInterest(id: string, interest: Interest): Promise<Interest> {
        return await this.interestRepositoryOutPort.update(id, interest);
    }

    async deleteInterestById(id: string): Promise<void> {
        await this.interestRepositoryOutPort.deleteById(id);
    }

    async getInterestById(id: string): Promise<Interest> {
        return await this.interestRepositoryOutPort.getById(id);
    }

    async getAllInterests(): Promise<Interest[]> {
        return await this.interestRepositoryOutPort.getAll();
    }
}