import { ServiceError } from '@/@shared/errors/service-error'

export class InactiveError extends Error implements ServiceError {
  constructor(entity: string) {
    super(`Entity Inactive error, entity: ${entity}`)
  }
}
