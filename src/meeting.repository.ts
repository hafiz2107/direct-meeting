import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Meetings } from './schemas/meetings.schema';

@Injectable()
export class MeetingsRepository extends AbstractRepository<Meetings> {
  protected readonly logger = new Logger(MeetingsRepository.name);

  constructor(
    @InjectModel(Meetings.name) meetingsModel: Model<Meetings>,
    @InjectConnection() connection: Connection,
  ) {
    super(meetingsModel, connection);
  }
}
