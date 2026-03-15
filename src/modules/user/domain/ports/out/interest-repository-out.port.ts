import { Interest } from "../../entities/interest.entity";

export interface InterestRepositoryOutPort {

    create(interest: Interest): Promise<Interest>;

    update(id: string, interest: Interest): Promise<Interest>;

    deleteById(id: string): void;

    getById(id: string): Promise<Interest>;

    getAll(): Promise<Interest[]>;

}