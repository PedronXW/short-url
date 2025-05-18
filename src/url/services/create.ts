import { Either, right } from '@/@shared/either'
import { EntityId } from '@/@shared/entities/entity-id'
import { InactiveError } from '@/@shared/errors/inactive-error'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { Url } from '../entities/url'
import { UrlRepository } from '../repositories/repository'
import { generateShortenedUrl } from '../utils/generateShortUrl'

export type CreateUrlServiceRequest = {
  fullUrl: string
  creator?: string
}

export type CreateUrlServiceResponse = Either<
  InactiveError | NonExistsError,
  Url
>

@Injectable()
export class CreateUrlService {
  constructor(
    private urlRepository: UrlRepository,
    private envService: EnvService,
  ) {}

  async execute({
    fullUrl,
    creator,
  }: CreateUrlServiceRequest): Promise<CreateUrlServiceResponse> {

    const url = Url.create({
      creator: creator ? new EntityId(creator) : undefined,
      shortened: this.envService.get('BASE_URL')+'/'+generateShortenedUrl(),
      url: fullUrl,
    })

    return right(await this.urlRepository.createUrl(url))
  }
}
