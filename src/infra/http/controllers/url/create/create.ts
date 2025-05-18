import { InactiveError } from '@/@shared/errors/inactive-error'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { Public } from '@/infra/auth/public'
import { ErrorDocsResponse } from '@/infra/http/documentation/responses/error-docs-response'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UrlPresenter } from '@/infra/http/presenters/presenter-url'
import { CreateUrlService } from '@/url/services/create'
import { Body, Controller, HttpCode, HttpException, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBody, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

const createUrlDTO = z.object({
  baseUrl: z.string().url(),
})

export type CreateUrlDTO = z.infer<typeof createUrlDTO>

const bodyValidation = new ZodValidationPipe(createUrlDTO)

@ApiTags('url')
@Public()
@Controller('/url')
export class CreateUrlController {
  constructor(private createUrlService: CreateUrlService) {}

  @ApiHeader({
          name: 'Authorization',
          description: 'Bearer token',
          required: false,
          example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          schema: {
            type: 'string',
            format: 'string',
            example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          },
  })
  @ApiBody({
      schema: {
        type: 'object',
        properties: {
          baseUrl: { type: 'string', format: 'url' },
        },
        required: ['baseUrl'],
        description: 'Base URL',
      },
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
              active: { type: 'boolean' },
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
  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidation) body: CreateUrlDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const { baseUrl } = body

    const sub = user && user.sub ? user.sub : undefined

    const url = await this.createUrlService.execute({
      creator: sub,
      fullUrl: baseUrl
    })

    if (url.isLeft()) {
      const error = url.value
      switch (error.constructor) {
        case InactiveError:
          throw new HttpException(error.message, 403)
        case NonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return { url: UrlPresenter.toHTTP(url.value) }
  }
}
