import { ServiceError } from '@/@shared/errors/service-error'

export class WrongCredentialsError extends Error implements ServiceError {
  constructor() {
    super(`Wrong credentials`)
  }
}
