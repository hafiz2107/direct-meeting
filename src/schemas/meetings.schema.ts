import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

class influencer {
  id: string;
  name: string;
  email: string;
}

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Meetings extends AbstractDocument {
  @Prop()
  status: string;

  @Prop()
  start_time: string;

  @Prop()
  end_time: string;

  @Prop()
  mode: string;

  @Prop()
  label: string;

  @Prop()
  scheduled_at: string;

  @Prop()
  scheduled_date: string;

  @Prop()
  scheduled_month: string;

  @Prop()
  scheduled_year: string;

  @Prop()
  description: string;

  @Prop()
  preview: boolean;

  @Prop()
  preview_url?: string;

  @Prop()
  influencer_id: ObjectId;

  @Prop()
  created_by_id: ObjectId;

  @Prop(influencer)
  influencer: influencer;

  @Prop(influencer)
  created_by: influencer;
}

export const MeetingsSchema = SchemaFactory.createForClass(Meetings);
