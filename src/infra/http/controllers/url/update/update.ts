import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import { ErrorDocsResponse } from '@/infra/http/documentation/responses/error-docs-response'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UrlPresenter } from '@/infra/http/presenters/presenter-url'
import { UpdateUrlService } from '@/url/services/update'
import { Body, Controller, HttpException, Param, Patch } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBody, ApiHeader, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

const updateUrlDTO = z.object({
  baseUrl: z.string().url(),
})

export type UpdateUrlDTO = z.infer<typeof updateUrlDTO>

const bodyValidation = new ZodValidationPipe(updateUrlDTO)

@ApiTags('url')
@Controller('/url')
export class UpdateUrlController {
  constructor(private updateUrlService: UpdateUrlService) {}

  @Patch('/:id')
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
      description: 'Url updated',
  })
  @ApiBadRequestResponse({
    description: 'Error updating url',
    type: ErrorDocsResponse,
  })
  async handle(
    @Param('id') id: string,
    @Body(bodyValidation) body: UpdateUrlDTO,
    @CurrentUser() url: UserPayload,
  ) {
    const { baseUrl } = body

    const { sub } = url

    const updatedUrl = await this.updateUrlService.execute({
      creator: sub,
      id,
      baseUrl,
    })

    if (updatedUrl.isLeft()) {
      const error = updatedUrl.value
      switch (error.constructor) {
        case NonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { url: UrlPresenter.toHTTP(updatedUrl.value) }
  }
}
