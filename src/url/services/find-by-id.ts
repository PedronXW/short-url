import { Either, left, right } from '@/@shared/either'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { Injectable } from '@nestjs/common'
import { Url } from '../entities/url'
import { UrlRepository } from '../repositories/repository'

type FindUrlByIdServiceRequest = {
  id: string
  userId: string
}

type FindUrlByIdServiceResponse = Either<NonExistsError, Url>

@Injectable()
export class FindUrlByIdService {
  constructor(private urlRepository: UrlRepository) {}

  async execute({
    id,
    userId,
  }: FindUrlByIdServiceRequest): Promise<FindUrlByIdServiceResponse> {
    const url = await this.urlRepository.findUrlById(id, userId)

    if (!url) {
      return left(new NonExistsError('Url'))
    }

    return right(url)
  }
}
