import { WrongCredentialsError } from '@/@shared/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'
import { AuthenticateUserService } from '@/user/services/authenticate'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { z } from 'zod'
import { ErrorDocsResponse } from '../../documentation/responses/error-docs-response'
import { TokenDocsResponse } from '../../documentation/responses/token-docs-response'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

export const authenticateUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type AuthenticateUserDTO = z.infer<typeof authenticateUserDTO>

@Public()
@ApiTags('authentication')
@Controller('/session')
export class AuthenticateUserController {
  constructor(private authenticateUserService: AuthenticateUserService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
      },
      required: ['email', 'password'],
      description: 'Email and password',
    },
  })
  @ApiOkResponse({
    type: TokenDocsResponse,
    description: 'Session created',
  })
  @ApiBadRequestResponse({
    description: 'Error creating a session',
    type: ErrorDocsResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorDocsResponse,
  })
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
