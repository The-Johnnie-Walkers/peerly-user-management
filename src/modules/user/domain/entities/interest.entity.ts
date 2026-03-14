import { Category } from '../enums/category.enum'
import { User } from './user.entity';

export class Interest{
    constructor(
        public id: string,
        public name: string,
        public category: Category,
        public users: User[]
    ) {}
}