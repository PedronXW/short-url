import { NestFactory } from '@nestjs/core'
import { EnvService } from '../env/env.service'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  const envService = app.get(EnvService)

  const port = envService.get('PORT')

  await app.startAllMicroservices()

  await app.listen(port)
}
bootstrap()
