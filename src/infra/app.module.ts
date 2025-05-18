import { AuthModule } from '@/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { SentryModule } from "@sentry/nestjs/setup";
import { envSchema } from '../env/env';
import { EnvModule } from '../env/env.module';
import { CatchAllExceptionFilter } from './http/errors/global-catch';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    SentryModule.forRoot(),
    AuthModule,
    HttpModule,
  ],
  providers: [EnvModule, {
      provide: APP_FILTER,
      useClass: CatchAllExceptionFilter,
    },],
})
export class AppModule {}
