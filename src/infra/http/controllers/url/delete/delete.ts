import { InactiveError } from '@/@shared/errors/inactive-error'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import { ErrorDocsResponse } from '@/infra/http/documentation/responses/error-docs-response'
import { DeleteUrlService } from '@/url/services/delete'
import {
  Controller,
  Delete,
  HttpCode,
  HttpException,
  Param,
} from '@nestjs/common'
import { ApiBadRequestResponse, ApiHeader, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'

@ApiTags('url')
@Controller('/url')
export class DeleteUrlController {
  constructor(private deleteUrlService: DeleteUrlService) {}

  @Delete('/:id')
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
      description: 'Url deleted',
  })
  @ApiBadRequestResponse({
      description: 'Error deleting url',
      type: ErrorDocsResponse,
  })
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const { sub } = user

    const result = await this.deleteUrlService.execute({
      id,
      userId: sub,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NonExistsError:
          throw new HttpException(error.message, 403)
        case InactiveError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }
  }
}
