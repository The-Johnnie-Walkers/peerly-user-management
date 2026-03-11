import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Category } from 'src/modules/user/domain/enums/category.enum';
import * as mongoose from 'mongoose';


export type InterestDocument = HydratedDocument<InterestSchema>

@Schema()
export class InterestSchema{

    @Prop({required: true})
    name: String;

    @Prop({required: true})
    category: Category;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: []})
    users: Array<mongoose.Schema.Types.ObjectId>;


}

export const InterestSchemaDefinition = SchemaFactory.createForClass(InterestSchema);