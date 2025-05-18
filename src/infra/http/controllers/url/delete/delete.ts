import { InactiveError } from '@/@shared/errors/inactive-error'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import { DeleteUrlService } from '@/url/services/delete'
import {
    Controller,
    Delete,
    HttpCode,
    HttpException,
    Param,
} from '@nestjs/common'

@Controller('/url')
export class DeleteUrlController {
  constructor(private deleteUrlService: DeleteUrlService) {}

  @Delete('/:id')
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
