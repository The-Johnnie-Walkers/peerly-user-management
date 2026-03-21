import { IsEnum, IsNotEmpty } from 'class-validator';
import { Category } from 'src/contexts/user/domain/enums/category.enum';

export class InterestRequestDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;
}
