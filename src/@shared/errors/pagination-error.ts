import { ServiceError } from '@/@shared/errors/service-error'

export class PaginationError extends Error implements ServiceError {
  constructor() {
    super(
      'Invalid pagination parameters, verify if page and limit are integers and greater than 0',
    )
  }
}
