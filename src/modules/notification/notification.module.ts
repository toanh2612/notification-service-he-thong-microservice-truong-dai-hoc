import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CONFIG } from "src/common/configs/config";
import { NotificationEntity } from "src/common/entities/notification.entity";
import { NotificationController } from "./notification.controller";
import NotificationService from "./notification.service";
import RabbitMQService from "../rabbitMQ/rabbitMQ.service";
import EventEmitterService from "../eventEmitter/evenEmitter.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: CONFIG.CLIENT_MODULE.REDIS,
        transport: Transport.REDIS,
        options: {
          db: 0,
          password: CONFIG["REDIS_PASSWORD"],
          port: CONFIG["REDIS_PORT"],
          host: CONFIG["REDIS_HOST"],
        },
      },
    ]),
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, RabbitMQService, EventEmitterService],
})
export class NotificationModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    return consumer;
  }
}
