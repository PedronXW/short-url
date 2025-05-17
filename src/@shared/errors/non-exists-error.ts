import { ServiceError } from '@/@shared/errors/service-error'

export class NonExistsError extends Error implements ServiceError {
  constructor(entity: string) {
    super(`Entity non exists error, entity: ${entity}`)
  }
}
