import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { WrongCredentialsError } from '@/@shared/errors/wrong-credentials-error'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import { ErrorDocsResponse } from '@/infra/http/documentation/responses/error-docs-response'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UserPresenter } from '@/infra/http/presenters/presenter'
import { ChangePasswordService } from '@/user/services/change-password'
import { Body, Controller, HttpException, Patch } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBody, ApiHeader, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

const changePasswordDTO = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8),
})

export type ChangePasswordDTO = z.infer<typeof changePasswordDTO>

const bodyValidation = new ZodValidationPipe(changePasswordDTO)

@ApiTags('user')
@Controller('/user/password')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

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
  @ApiBody({
      schema: {
        type: 'object',
        properties: {
          newPassword: { type: 'string', minLength: 8 },
          password: { type: 'string', minLength: 8 },
        },
        required: ['newPassword', 'password'],
        description: 'NewPassword and password',
      },
    })
  @ApiParam({
      name: 'id',
      description: 'User ID',
      type: 'string',
      required: true,
      example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              email: { type: 'string', maxLength: 140 },
              active: { type: 'boolean' },
            },
          },
        },
      },
      description: 'User password changed',
  })
  @ApiBadRequestResponse({
    description: 'Error changing password',
    type: ErrorDocsResponse,
  })
  @Patch()
  async handle(
    @Body(bodyValidation) body: ChangePasswordDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub } = user

    const { password, newPassword } = body

    const editedUser = await this.changePasswordService.execute(
      sub,
      password,
      newPassword,
    )

    if (editedUser.isLeft()) {
      const error = editedUser.value
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new HttpException(error.message, 401)
        case NonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return { user: UserPresenter.toHTTP(editedUser.value) }
  }
}
