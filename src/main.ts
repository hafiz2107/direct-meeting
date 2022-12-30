import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MeetingModule } from './meeting.module';

async function bootstrap() {
  const app = await NestFactory.create(MeetingModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const rmqService = app.get(RmqService);

  app.connectMicroservice(rmqService.getOptions('MEETING'));

  await app.startAllMicroservices();
  await app.listen(configService.get<string>('PORT'), () =>
    console.log(`Listening on http://localhost:${configService.get('PORT')}`),
  );
}
bootstrap();
