import { IsEnum, IsNotEmpty } from 'class-validator';
import { Category } from '../../../../../../domain/enums/category.enum';

export class InterestRequestDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;
}
