import { Injectable, Logger } from '@nestjs/common';
import { CreateMeetingRequest } from './dto/create-meeting.dto';
import { MeetingsRepository } from './meeting.repository';

@Injectable()
export class MeetingService {
  constructor(private readonly meetingRepository: MeetingsRepository) {}
  private readonly logger = new Logger(MeetingService.name);

  async createMeeting(request: CreateMeetingRequest) {
    return await this.meetingRepository.create(request);
  }

  async meet(data) {
    this.logger.log('Meeting...', data);
  }

  async getUpcomingMeetings({ skip, take, influencerId }) {
    try {
      const meetings = await this.meetingRepository.find(
        {
          influencer_id: influencerId,
          status: 'ACCEPTED',
          scheduled_at: { $gte: new Date().toISOString() },
        },
        skip,
        take,
      );
      return meetings;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getPendingRequestCount({ influencer_id }) {
    try {
      const pendingRequestCount = await this.meetingRepository.find(
        {
          influencer_id: influencer_id,
          status: 'PENDING',
          scheduled_at: { $gte: new Date().toISOString() },
        },
        0,
        0,
        true,
      );

      return pendingRequestCount;
    } catch (err) {
      throw new Error(err);
    }
  }

  async handleMeetingStatus({
    influencer_id,
    meetingId,
    status,
    skip,
    take,
    sortKey,
    sortDirection,
  }) {
    const session = await this.meetingRepository.startTransaction();
    try {
      const updatedResult = await this.meetingRepository.findOneAndUpdate(
        {
          _id: meetingId,
        },
        {
          $set: {
            status,
          },
        },
        session,
      );
      const allMeetings = await this.meetingRepository.find(
        {
          $and: [
            {
              influencer_id: influencer_id,
            },
            {
              scheduled_at: {
                $gte: new Date().toISOString(),
              },
            },
          ],
        },
        skip,
        take,
        false,
        sortKey,
        sortDirection,
      );

      session.commitTransaction();
      return { allMeetings, updatedResult };
    } catch (err) {
      session.abortTransaction();
      throw new Error(err);
    }
  }

  async getScheduledMeeting({
    influencerId,
    date,
    meetingType,
    skip,
    take,
    sortKey,
    sortDirection,
  }) {
    try {
      const initialDate = new Date(date);

      const filter = [
        {
          scheduled_at: {
            $gte: initialDate.toISOString(),
          },
        },
        {
          influencer_id: influencerId,
        },
        {
          status: 'PENDING',
        },
        {
          mode: meetingType,
        },
      ];

      meetingType === 'ALL' && filter.pop();

      const meetings = await this.meetingRepository.find(
        {
          $and: filter,
        },
        skip,
        take,
        false,
        sortKey,
        sortDirection,
      );
      return meetings;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getPendingRequests({
    influencerId,
    skip,
    take,
    sortKey,
    sortDirection,
  }) {
    try {
      const result = await this.meetingRepository.find(
        {
          $and: [
            {
              influencer_id: influencerId,
            },
            {
              scheduled_at: {
                $gte: new Date().toISOString(),
              },
            },
            {
              status: 'PENDING',
            },
          ],
        },
        skip,
        take,
        false,
        sortKey,
        sortDirection,
      );

      return result;
    } catch (err) {
      throw new Error(err);
    }
  }
}
