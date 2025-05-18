import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { PaginationError } from '../../@shared/errors/pagination-error'
import {
    FindUrlsResponse,
    UrlRepository,
} from '../repositories/repository'

type FindUrlsServiceRequest = {
  page: number
  limit: number
  userId: string
}

type FindUrlsServiceResponse = Either<PaginationError, FindUrlsResponse>

@Injectable()
export class FindUrlsService {
  constructor(private urlRepository: UrlRepository) {}

  async execute({
    page,
    limit,
    userId,
  }: FindUrlsServiceRequest): Promise<FindUrlsServiceResponse> {
    if (page <= 0 || limit <= 0) {
      return left(new PaginationError())
    }

    const urls = await this.urlRepository.findUrls(
      page,
      limit,
      userId,
    )

    return right(urls)
  }
}
