import { ServiceError } from '@/@shared/errors/service-error'

export class NotAllowedError extends Error implements ServiceError {
  constructor() {
    super('Not allowed')
  }
}
