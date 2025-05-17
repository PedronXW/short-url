import { WrongCredentialsError } from '@/@shared/errors/wrong-credentials-error'
import { Public } from '@/auth/public'
import { AuthenticateUserService } from '@/user/services/authenticate'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

export const authenticateUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type AuthenticateUserDTO = z.infer<typeof authenticateUserDTO>

@Public()
@Controller('/session')
export class AuthenticateUserController {
  constructor(private authenticateUserService: AuthenticateUserService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateUserDTO))
  async handle(@Body() body: AuthenticateUserDTO) {
    const { email, password } = body

    const token = await this.authenticateUserService.execute({
      email,
      password,
    })

    if (token.isLeft()) {
      const error = token.value
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      tokens: {
        accessToken: token.value.token,
      },
    }
  }
}
