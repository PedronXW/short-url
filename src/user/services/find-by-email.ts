import { Either, left, right } from '@/@shared/either'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { Injectable } from '@nestjs/common'
import { User } from '../entities/user'
import { UserRepository } from '../repositories/user-repository'

type FindUserByEmailServiceRequest = {
  email: string
}

type FindUserByEmailServiceResponse = Either<NonExistsError, User>

@Injectable()
export class FindUserByEmailService {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
  }: FindUserByEmailServiceRequest): Promise<FindUserByEmailServiceResponse> {
    const user = await this.userRepository.findUserByEmail(email)

    if (!user) {
      return left(new NonExistsError('User'))
    }

    return right(user)
  }
}
