import { Interest } from "../../domain/entities/interest.entity";
import { CreateInterestUseCase } from "../../domain/ports/in/create-interest-use-case.port";
import { DeleteInterestUseCase } from "../../domain/ports/in/delete-interest-use-case.port";
import { GetAllInterestsUseCase } from "../../domain/ports/in/get-all-interests-use-case.port";
import { GetInterestUseCase } from "../../domain/ports/in/get-interest-use.case.port";
import { UpdateInterestUseCase } from "../../domain/ports/in/update-interest-use-case.port";

export class InterestService implements CreateInterestUseCase, UpdateInterestUseCase, DeleteInterestUseCase, GetInterestUseCase, GetAllInterestsUseCase {

  constructor(
    private createInterestUseCase: CreateInterestUseCase,
    private updateInterstUseCase: UpdateInterestUseCase,
    private deleteInterestUseCase: DeleteInterestUseCase,
    private getInterestUseCase: GetInterestUseCase,
    private getAllInterestsUseCase: GetAllInterestsUseCase
  ) { }

  createInterest(interest: Interest): Promise<Interest> {
    return this.createInterestUseCase.createInterest(interest);
  }

  updateInterest(id: string, interest: Interest): Promise<Interest> {
    return this.updateInterstUseCase.updateInterest(id, interest);
  }

  deleteInterestById(id: string): Promise<void> {
    this.deleteInterestUseCase.deleteInterestById(id);
    return Promise.resolve();
  }

  getInterestById(id: string): Promise<Interest> {
    return this.getInterestUseCase.getInterestById(id);
  }

  getAllInterests(): Promise<Interest[]> {
    return this.getAllInterestsUseCase.getAllInterests();
  }

}
