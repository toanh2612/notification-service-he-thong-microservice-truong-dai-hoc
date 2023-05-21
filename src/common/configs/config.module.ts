import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CONFIG, CONFIGURATION } from "./config";
import { NotificationEntity } from "../entities/notification.entity";

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: false,
			envFilePath: `${process.env["NODE_ENV"]}`,
			isGlobal: true,
			load: [CONFIGURATION],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: "postgres",
				// logger: 'advanced-console',
				logging: true,
				host: configService.get<string>("DATABASE_HOST"),
				port: +configService.get<number>("DATABASE_PORT"),
				username: configService.get<string>("DATABASE_USERNAME"),
				password: configService.get<string>("DATABASE_PASSWORD"),
				database: configService.get<string>("DATABASE_NAME"),
				entities: [NotificationEntity],
				synchronize: CONFIG["NODE_ENV"] === "production" ? false : true,
				// migrationsRun: true,
			}),

			dataSourceFactory: async (options) => {
				const dataSource = await new DataSource(options).initialize();
				return dataSource;
			},
		}),
	],
	controllers: [],
	providers: [],
})
export class CustomConfigModule {}
