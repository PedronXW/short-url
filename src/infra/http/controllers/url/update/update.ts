import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UrlPresenter } from '@/infra/http/presenters/presenter-url'
import { UpdateUrlService } from '@/url/services/update'
import { Body, Controller, HttpException, Param, Patch } from '@nestjs/common'
import { z } from 'zod'

const updateUrlDTO = z.object({
  baseUrl: z.string().url(),
})

export type UpdateUrlDTO = z.infer<typeof updateUrlDTO>

const bodyValidation = new ZodValidationPipe(updateUrlDTO)

@Controller('/url')
export class UpdateUrlController {
  constructor(private updateUrlService: UpdateUrlService) {}

  @Patch('/:id')
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
