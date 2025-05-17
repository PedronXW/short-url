import { ServiceError } from '@/@shared/errors/service-error'

export class AlreadyExistsError extends Error implements ServiceError {
  constructor(entity: string) {
    super(`Entity already exists error, entity: ${entity}`)
  }
}
