import { InactiveError } from '@/@shared/errors/inactive-error'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import { DeleteUserService } from '@/user/services/delete'
import { Controller, Delete, HttpCode, HttpException } from '@nestjs/common'

@Controller('/user')
export class DeleteUserController {
  constructor(private deleteUserService: DeleteUserService) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload) {
    const { sub } = user

    const result = await this.deleteUserService.execute({
      id: sub,
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
