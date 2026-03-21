import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Category } from 'src/contexts/user/domain/enums/category.enum';

export type InterestDocument = HydratedDocument<InterestSchema>;

@Schema()
export class InterestSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: Category;
}

export const InterestSchemaDefinition =
  SchemaFactory.createForClass(InterestSchema);
