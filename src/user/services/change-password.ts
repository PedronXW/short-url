import { Either, left, right } from '@/@shared/either'

import { HashComparer } from '@/@shared/criptography/hash-comparer'
import { HashGenerator } from '@/@shared/criptography/hash-generator'
import { InactiveError } from '@/@shared/errors/inactive-error'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { WrongCredentialsError } from '@/@shared/errors/wrong-credentials-error'
import { Injectable } from '@nestjs/common'
import { User } from '../entities/user'
import { UserRepository } from '../repositories/user-repository'

type ChangePasswordServiceResponse = Either<
  NonExistsError | WrongCredentialsError | InactiveError,
  User
>

@Injectable()
export class ChangePasswordService {
  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    id: string,
    password: string,
    newPassword: string,
  ): Promise<ChangePasswordServiceResponse> {
    const user = await this.userRepository.findUserById(id)

    if (!user) {
      return left(new NonExistsError('User'))
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

    const editResult = await this.userRepository.changePassword(
      id,
      await this.hashGenerator.hash(newPassword),
    )

    return right(editResult)
  }
}
