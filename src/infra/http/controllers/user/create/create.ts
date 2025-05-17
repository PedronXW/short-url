import { Public } from '@/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UserPresenter } from '@/infra/http/presenters/presenter'
import { CreateUserService } from '@/user/services/create'
import { Body, Controller, HttpException, Post } from '@nestjs/common'
import { z } from 'zod'

const createUserDTO = z.object({
  email: z.string().email().max(140),
  password: z.string().min(8),
})

export type CreateUserDTO = z.infer<typeof createUserDTO>

const bodyValidation = new ZodValidationPipe(createUserDTO)

@Public()
@Controller('/user')
export class CreateUserController {
  constructor(private createUserService: CreateUserService) {}

  @Post()
  async handle(@Body(bodyValidation) body: CreateUserDTO) {
    const { email, password } = body

    const user = await this.createUserService.execute({
      email,
      password,
    })

    if (user.isLeft()) {
      const error = user.value
      switch (error.constructor) {
        default:
          throw new HttpException('Error creating user', 400)
      }
    }

    return { user: UserPresenter.toHTTP(user.value) }
  }
}
