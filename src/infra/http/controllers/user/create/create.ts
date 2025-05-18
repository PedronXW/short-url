import { Public } from '@/auth/public'
import { ErrorDocsResponse } from '@/infra/http/documentation/responses/error-docs-response'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { UserPresenter } from '@/infra/http/presenters/presenter'
import { CreateUserService } from '@/user/services/create'
import { Body, Controller, HttpException, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

const createUserDTO = z.object({
  email: z.string().email().max(140),
  password: z.string().min(8),
})

export type CreateUserDTO = z.infer<typeof createUserDTO>

const bodyValidation = new ZodValidationPipe(createUserDTO)

@ApiTags('user')
@Public()
@Controller('/user')
export class CreateUserController {
  constructor(private createUserService: CreateUserService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', maxLength: 140 },
        password: { type: 'string', minLength: 8 },
      },
      required: ['email', 'password'],
      description: 'Email and password',
    },
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
    description: 'User created',
  })
  @ApiBadRequestResponse({
    description: 'Error creating user',
    type: ErrorDocsResponse,
  })
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
