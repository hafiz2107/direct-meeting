import { DatabaseModule, FirebaseAuthStrategy, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import {
  Meetings,
  MeetingsSchema,
} from '../../meeting/src/schemas/meetings.schema';
import { MeetingsRepository } from './meeting.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_MEETING_QUEUE: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/meeting/.env',
    }),
    RmqModule,
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Meetings.name, schema: MeetingsSchema },
    ]),
  ],
  controllers: [MeetingController],
  providers: [MeetingService, MeetingsRepository, FirebaseAuthStrategy],
})
export class MeetingModule {}
