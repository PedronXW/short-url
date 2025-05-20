import { Encrypter } from '@/@shared/criptography/encrypter'
import { HashComparer } from '@/@shared/criptography/hash-comparer'
import { Either, left, right } from '@/@shared/either'
import { InactiveError } from '@/@shared/errors/inactive-error'
import { WrongCredentialsError } from '@/@shared/errors/wrong-credentials-error'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'

type AuthenticateUserServiceRequest = {
  email: string
  password: string
}

type AuthenticateUserServiceResponse = Either<
  WrongCredentialsError | InactiveError,
  { token: string }
>

@Injectable()
export class AuthenticateUserService {
  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserServiceRequest): Promise<AuthenticateUserServiceResponse> {
    const user = await this.userRepository.findUserByEmail(email)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    if (user.deletedAt) {
      return left(new InactiveError('User'))
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      user.password!,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialsError())
    }

    const token = await this.encrypter.encrypt({
      sub: user.id.getValue(),
    })

    return right({ token })
  }
}
