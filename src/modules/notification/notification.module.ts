import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CONFIG } from "src/common/configs/config";
import { NotificationEntity } from "src/common/entities/notification.entity";
import { NotificationController } from "./notification.controller";
import NotificationService from "./notification.service";

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
	providers: [NotificationService],
})
export class NotificationModule implements NestModule {
	constructor() {}

	configure(consumer: MiddlewareConsumer) {
		return consumer;
	}
}
