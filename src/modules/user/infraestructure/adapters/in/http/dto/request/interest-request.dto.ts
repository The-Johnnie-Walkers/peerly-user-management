import { IsEnum, IsNotEmpty } from "class-validator";
import { Category } from "src/modules/user/domain/enums/category.enum";

export class InterestRequestDTO {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEnum(Category)
    category: Category;
    
}