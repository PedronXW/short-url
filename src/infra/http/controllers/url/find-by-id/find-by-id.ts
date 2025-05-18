import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import { UrlPresenter } from '@/infra/http/presenters/presenter-url'
import { FindUrlByIdService } from '@/url/services/find-by-id'
import { Controller, Get, HttpException, Param } from '@nestjs/common'

@Controller('/url')
export class FindUrlByIdController {
  constructor(
    private readonly findUrlByIdService: FindUrlByIdService,
  ) {}

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
