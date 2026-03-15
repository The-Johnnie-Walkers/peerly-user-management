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

    createInterest(interest: Interest): Interest {
        return this.interestRepositoryOutPort.create(interest);
    }

    updateInterest(id: string, interest: Interest): Interest {
        return this.interestRepositoryOutPort.update(id, interest);
    }

    deleteInterestById(id: string): void {
        this.interestRepositoryOutPort.deleteById(id);
    }

    getInterestById(id: string): Interest {
        return this.interestRepositoryOutPort.getById(id);
    }

    getAllInterests(): Interest[] {
        return this.interestRepositoryOutPort.getAll();
    }
}