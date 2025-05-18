import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'

import { InactiveError } from '@/@shared/errors/inactive-error'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { UrlRepository } from '../repositories/repository'

type DeleteUrlServiceRequest = {
  id: string
  userId: string
}

type DeleteUrlServiceResponse = Either<
  NonExistsError | InactiveError,
  boolean
>

@Injectable()
export class DeleteUrlService {
  constructor(private urlRepository: UrlRepository) {}

  async execute({
    id,
    userId,
  }: DeleteUrlServiceRequest): Promise<DeleteUrlServiceResponse> {
    const url = await this.urlRepository.findUrlById(id, userId)

    if (!url) {
      return left(new NonExistsError('Url'))
    }

    if (!url.active) {
      return left(new InactiveError('Url'))
    }

    const result = await this.urlRepository.deleteUrl(id)

    return right(result)
  }
}
