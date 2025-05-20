import { Either, left, right } from '@/@shared/either'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { Injectable } from '@nestjs/common'
import { Url } from '../entities/url'
import { UrlRepository } from '../repositories/repository'

type UpdateUrlServiceRequest = {
  baseUrl: string
  id: string
  creator: string
}

type UpdateUrlServiceResponse = Either<NonExistsError, Url>

@Injectable()
export class UpdateUrlService {
  constructor(private urlRepository: UrlRepository) {}

  async execute({
    baseUrl,
    id,
    creator,
  }: UpdateUrlServiceRequest): Promise<UpdateUrlServiceResponse> {
    const url = await this.urlRepository.findUrlById(id, creator)

    if (!url) {
      return left(new NonExistsError('Url'))
    }

    if (url.deletedAt) {
      return left(new NonExistsError('Url'))
    }

    url.url = baseUrl

    const updatedUrl = await this.urlRepository.updateUrl(
      id,
      url,
    )

    return right(updatedUrl)
  }
}
