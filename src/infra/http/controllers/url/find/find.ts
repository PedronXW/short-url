import { PaginationError } from '@/@shared/errors/pagination-error'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import { UrlPresenter } from '@/infra/http/presenters/presenter-url'
import { FindUrlsService } from '@/url/services/find'
import { Controller, Get, HttpException, Query } from '@nestjs/common'

@Controller('/url')
export class FindUrlsController {
  constructor(private readonly findUrlsService: FindUrlsService) {}

  @Get()
  async handle(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @CurrentUser() url: UserPayload,
  ) {
    const { sub } = url

    const receivedUrl = await this.findUrlsService.execute({
      limit: Number.parseInt(limit),
      page: Number.parseInt(page),
      userId: sub,
    })

    if (receivedUrl.isLeft()) {
      const error = receivedUrl.value
      switch (error.constructor) {
        case PaginationError:
          throw new HttpException(error.message, 400)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return {
      urls: receivedUrl.value.urls.map(UrlPresenter.toHTTP),
      urlsCount: receivedUrl.value.urlsCount,
    }
  }
}
