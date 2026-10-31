import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({timestamps:true})
export class User {
  @Prop({ required: true, unique: true })
  email!: string;
  @Prop({ required: true, unique: true })
  username!: string;
  @Prop({ required: true })
  password!: string;
  @Prop()
  name!: string;
  @Prop()
  role!: 'manger' | 'user' | 'client' | 'staff';
}

export const UserSchema = SchemaFactory.createForClass(User);
