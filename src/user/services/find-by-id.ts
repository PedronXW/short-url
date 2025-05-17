import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { NonExistsError } from '../../@shared/errors/non-exists-error'
import { User } from '../entities/user'
import { UserRepository } from '../repositories/user-repository'

type FindUserByIdServiceRequest = {
  id: string
}

type FindUserByIdServiceResponse = Either<NonExistsError, User>

@Injectable()
export class FindUserByIdService {
  constructor(private userRepository: UserRepository) {}

  async execute({
    id,
  }: FindUserByIdServiceRequest): Promise<FindUserByIdServiceResponse> {
    const user = await this.userRepository.findUserById(id)

    if (!user) {
      return left(new NonExistsError('User'))
    }

    return right(user)
  }
}
