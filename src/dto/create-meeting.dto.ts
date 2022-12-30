import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateMeetingRequest {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  start_time: string;

  @IsString()
  @IsNotEmpty()
  end_time: string;

  @IsNotEmpty()
  @IsString()
  mode: string;

  @IsString()
  @IsNotEmpty()
  scheduled_at: string;

  @IsString()
  @IsNotEmpty()
  scheduled_date: string;

  @IsString()
  @IsNotEmpty()
  scheduled_month: string;

  @IsString()
  @IsNotEmpty()
  scheduled_year: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  preview: boolean;

  @IsString()
  preview_url: string;

  @IsString()
  @IsNotEmpty()
  influencer_id: ObjectId;

  @IsString()
  @IsNotEmpty()
  created_by_id: ObjectId;

  @IsNotEmpty()
  influencer: influencer;

  @IsNotEmpty()
  created_by: influencer;
}

interface influencer {
  id: string;
  name: string;
  email: string;
}
