import { RmqService } from '@app/common';
import { Body, Controller, Post } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { CreateMeetingRequest } from './dto/create-meeting.dto';
import { MeetingService } from './meeting.service';

@Controller('meeting')
export class MeetingController {
  constructor(
    private readonly meetingService: MeetingService,
    private readonly rmqService: RmqService,
  ) {}

  @Post('/create-meeting')
  async createMeeting(@Body() request: CreateMeetingRequest) {
    try {
      return this.meetingService.createMeeting(request);
    } catch (err) {}
  }

  @EventPattern('influencer_created')
  async handleInfluencerCreated(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    console.log('From meeting service INFLUENCER CREATED -> ', context);
    this.meetingService.meet(data);
    this.rmqService.ack(context);
  }

  @EventPattern('get_upcoming_meetings')
  async handleGetUpcomingMeeting(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    try {
      const result = await this.meetingService.getUpcomingMeetings(data);
      this.rmqService.ack(context);
      return result;
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @EventPattern('get_pending_request_count')
  async handlePendingRequestCount(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    try {
      const result = await this.meetingService.getPendingRequestCount(data);
      this.rmqService.ack(context);
      return result;
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @EventPattern('accept_pending_request')
  async handleMeetingStatus(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      const result = await this.meetingService.handleMeetingStatus(data);
      this.rmqService.ack(context);
      return result;
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @EventPattern('get-scheduled-meetings')
  async handleGetScheduledMeetings(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    try {
      const result = this.meetingService.getScheduledMeeting(data);
      this.rmqService.ack(context);
      return result;
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @EventPattern('get-pending-request')
  async hanldleGetPendingRequests(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    try {
      const result = await this.meetingService.getPendingRequests(data);
      this.rmqService.ack(context);
      return result;
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
