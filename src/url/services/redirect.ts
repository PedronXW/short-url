import { Either, left, right } from '@/@shared/either'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { EnvService } from '@/infra/env/env.service'
import { Url } from '@/url/entities/url'
import { UrlRepository } from '@/url/repositories/repository'
import { Injectable } from '@nestjs/common'

type FindUrlByShortenedServiceRequest = {
  shortened: string
}

type FindUrlByShortenedServiceResponse = Either<NonExistsError, Url>

@Injectable()
export class FindUrlByShortenedService {
  constructor(private urlRepository: UrlRepository, private envService:EnvService) {}

  async execute({
    shortened
  }: FindUrlByShortenedServiceRequest): Promise<FindUrlByShortenedServiceResponse> {
    const url = await this.urlRepository.findUrlByShortened(this.envService.get("BASE_URL")+"/"+shortened)

    if (!url) {
      return left(new NonExistsError('Url'))
    }

    if(!url.active) {
      return left(new NonExistsError('Url'))
    }

    url.increaseAccessCount()

    await this.urlRepository.updateUrl(url.id.getValue(), url)

    return right(url)
  }
}
