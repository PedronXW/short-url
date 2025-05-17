import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { WrongCredentialsError } from '@/@shared/errors/wrong-credentials-error'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UserPresenter } from '@/infra/http/presenters/presenter'
import { ChangePasswordService } from '@/user/services/change-password'
import { Body, Controller, HttpException, Patch } from '@nestjs/common'
import { z } from 'zod'

const changePasswordDTO = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8),
})

export type ChangePasswordDTO = z.infer<typeof changePasswordDTO>

const bodyValidation = new ZodValidationPipe(changePasswordDTO)

@Controller('/user/password')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

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
