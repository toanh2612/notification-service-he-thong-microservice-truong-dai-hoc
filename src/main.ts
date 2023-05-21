import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { CONFIG } from "./common/configs/config";
import { initializeTransactionalContext } from "typeorm-transactional-cls-hooked";
import { ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

process.on("unhandledRejection", (error) => {
  console.log("unhandledRejection", error);
});

process.on("uncaughtException", (error) => {
  console.log("uncaughtException", error);
});

async function bootstrap() {
  const httpServer = await NestFactory.create(AppModule);

  httpServer.useGlobalPipes(new ValidationPipe({}));

  httpServer.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
    })
  );
  httpServer.useGlobalFilters(
    new AllExceptionsFilter(httpServer.get(HttpAdapterHost))
  );
  httpServer.enableCors();

  const config = new DocumentBuilder()
    .setTitle("notification.edu-microservice.site API")
    .setDescription("notification.edu-microservice.site API")
    .setVersion("1.0")
    .addTag("notification.edu-microservice.site")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(httpServer, config);
  SwaggerModule.setup("/docs", httpServer, document);

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.REDIS,
      options: {
        password: CONFIG["REDIS_CLIENT_PASSWORD"],
        port: Number(CONFIG["REDIS_CLIENT_PORT"]),
        host: CONFIG["REDIS_CLIENT_HOST"],
        retryAttempts: 5,
        retryDelay: 5000,
        db: 0,
      },
    });
  await Promise.all([
    microservice.listen().then(() => {
      console.log("Start microservice");
    }),
    httpServer.listen(Number(CONFIG["APP_PORT"]), "0.0.0.0", async () => {
      console.log("Start HTTP server");
    }),
  ]);
}

initializeTransactionalContext();
bootstrap();
