import { ServiceError } from '@/@shared/errors/service-error'

export class PermissionError extends Error implements ServiceError {
  constructor() {
    super('User without permission to do that action')
  }
}
