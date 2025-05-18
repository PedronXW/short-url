import { Catch, ExceptionFilter } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from "@sentry/nestjs";
import { SentryExceptionCaptured } from '@sentry/nestjs';

@Catch()
export class CatchAllExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception, host): void {
    Sentry.captureException(exception);
    super.catch(exception, host);
  }
}