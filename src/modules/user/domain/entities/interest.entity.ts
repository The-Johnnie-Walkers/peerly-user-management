import { Category } from '../enums/category.enum'
import { User } from './user.entity';

export class Interest{
    constructor(
        public id: String,
        public name: String,
        public category: Category,
        public users: Array<User>
    ) {}
}