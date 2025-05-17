import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import { UserPresenter } from '@/infra/http/presenters/presenter'
import { FindUserByIdService } from '@/user/services/find-by-id'
import { Controller, Get, HttpException } from '@nestjs/common'

@Controller('/user')
export class FindUserByIdController {
  constructor(private readonly findUserByIdService: FindUserByIdService) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const { sub } = user

    const receivedUser = await this.findUserByIdService.execute({
      id: sub,
    })

    if (receivedUser.isLeft()) {
      const error = receivedUser.value
      switch (error.constructor) {
        case NonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { user: UserPresenter.toHTTP(receivedUser.value) }
  }
}
