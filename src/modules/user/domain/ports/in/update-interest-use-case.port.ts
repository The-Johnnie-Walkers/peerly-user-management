import { Interest } from "../../entities/interest.entity";

export interface UpdateInterestUseCase {

    updateInterest(id: string, interest: Interest): Promise<Interest>;

}