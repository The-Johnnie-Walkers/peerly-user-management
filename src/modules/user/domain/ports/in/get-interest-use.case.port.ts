import { Interest } from "../../entities/interest.entity";


export interface GetInterestUseCase {

    getInterestById(id: string): Interest;
    
}