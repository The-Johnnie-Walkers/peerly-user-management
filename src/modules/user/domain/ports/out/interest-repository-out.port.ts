import { Interest } from "../../entities/interest.entity";

export interface InterestRepositoryOutPort {

    create(interest: Interest): Interest;

    update(id: string, interest: Interest): Interest;

    deleteById(id: string): void;

    getById(id: string): Interest;

    getAll(): Interest[];

}