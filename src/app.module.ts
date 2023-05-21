import { Global, Module } from "@nestjs/common";
import { CustomConfigModule } from "./common/configs/config.module";
import { NotificationModule } from "./modules/notification/notification.module";

@Global()
@Module({
	imports: [CustomConfigModule, NotificationModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
