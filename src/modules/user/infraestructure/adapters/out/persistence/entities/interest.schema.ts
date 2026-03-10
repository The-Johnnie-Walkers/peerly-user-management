import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type InterestDocument = HydratedDocument<InterestSchema>

@Schema()
export class InterestSchema{


}

export const InterestSchemaDefinition = SchemaFactory.createForClass(InterestSchema);