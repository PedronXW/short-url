import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ErrorDocsResponse } from '@/infra/http/documentation/responses/error-docs-response'
import { UrlPresenter } from '@/infra/http/presenters/presenter-url'
import { FindUrlByIdService } from '@/url/services/find-by-id'
import { Controller, Get, HttpException, Param } from '@nestjs/common'
import { ApiBadRequestResponse, ApiHeader, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'

@ApiTags('url')
@Controller('/url')
export class FindUrlByIdController {
  constructor(
    private readonly findUrlByIdService: FindUrlByIdService,
  ) {}

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
  @ApiParam({
        name: 'id',
        description: 'Url ID',
        type: 'string',
        required: true,
        example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
        schema: {
          type: 'object',
          properties: {
            url: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                url: { type: 'string', format: 'url' },
                shortUrl: { type: 'string', format: 'url' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                userId: { type: 'string', format: 'uuid' },
                accessCount: { type: 'number' },
                deletedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      description: 'Url created',
  })
  @ApiBadRequestResponse({
      description: 'Error creating url',
      type: ErrorDocsResponse,
  })
  @Get('/:id')
  async handle(@Param('id') id: string, @CurrentUser() url: UserPayload) {
    const { sub } = url

    const receivedUrl = await this.findUrlByIdService.execute({
      id,
      userId: sub,
    })

    if (receivedUrl.isLeft()) {
      const error = receivedUrl.value
      switch (error.constructor) {
        case NonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { url: UrlPresenter.toHTTP(receivedUrl.value) }
  }
}
