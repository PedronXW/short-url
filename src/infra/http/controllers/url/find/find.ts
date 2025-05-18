import { PaginationError } from '@/@shared/errors/pagination-error'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import { ErrorDocsResponse } from '@/infra/http/documentation/responses/error-docs-response'
import { UrlPresenter } from '@/infra/http/presenters/presenter-url'
import { FindUrlsService } from '@/url/services/find'
import { Controller, Get, HttpException, Query } from '@nestjs/common'
import { ApiBadRequestResponse, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('url')
@Controller('/url')
export class FindUrlsController {
  constructor(private readonly findUrlsService: FindUrlsService) {}

  @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token',
        required: true,
        example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        schema: {
          type: 'string',
          format: 'string',
          example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        },
  })
  @ApiOkResponse({
        schema: {
          type: 'object',
          properties: {
            urls: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  url: { type: 'string', format: 'url' },
                  shortUrl: { type: 'string', format: 'url' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  userId: { type: 'string', format: 'uuid' },
                  accessCount: { type: 'number' },
                  active: { type: 'boolean' },
                },
              },
            },
            urlsCount: { type: 'number' },
          },
        },
      description: 'Urls found',
  })
  @ApiBadRequestResponse({
      description: 'Error finding urls',
      type: ErrorDocsResponse,
  })
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
