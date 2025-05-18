import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvService } from '../env/env.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  const envService = app.get(EnvService)

  const port = envService.get('PORT')

  const config = new DocumentBuilder()
    .setTitle('ShortUrl')
    .setDescription('The Shorturl API description')
    .setVersion('1.0')
    .addTag('url')
    .addTag('user')
    .addTag('redirect')
    .addTag('authentication')
    .addTag('health')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/v1/docs', app, document);

  await app.startAllMicroservices()

  await app.listen(port)
}
bootstrap()
