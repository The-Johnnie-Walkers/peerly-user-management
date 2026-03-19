import { Interest } from "../../entities/interest.entity";

export interface InterestRepositoryOutPort {

    save(interest: Interest): Promise<Interest>;

    update(id: string, interest: Interest): Promise<Interest>;

    deleteById(id: string): Promise<void>;

    findById(id: string): Promise<Interest>;

    findAll(): Promise<Interest[]>;

}