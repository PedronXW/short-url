import { InactiveError } from '@/@shared/errors/inactive-error'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import { Public } from '@/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UrlPresenter } from '@/infra/http/presenters/presenter-url'
import { CreateUrlService } from '@/url/services/create'
import { Body, Controller, HttpException, Post } from '@nestjs/common'
import { z } from 'zod'

const createUrlDTO = z.object({
  baseUrl: z.string().url(),
})

export type CreateUrlDTO = z.infer<typeof createUrlDTO>

const bodyValidation = new ZodValidationPipe(createUrlDTO)

@Public()
@Controller('/url')
export class CreateUrlController {
  constructor(private createUrlService: CreateUrlService) {}

  @Post()
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
