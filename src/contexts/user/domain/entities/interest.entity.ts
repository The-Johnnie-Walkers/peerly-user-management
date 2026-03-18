import { Category } from '../enums/category.enum'

export interface InterestProps {
    id: string;
    name: string;
    category: Category;
}

export class Interest {
    constructor(
        private props: InterestProps
    ) { }

    get id(): string {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get category(): Category {
        return this.props.category;
    }
    
    set name(name: string) {
        this.props.name = name;
    }

    set category(category: Category) {
        this.props.category = category;
    }

}