import { Either, left, right } from '@/@shared/either'
import { InactiveError } from '@/@shared/errors/inactive-error'
import { NonExistsError } from '@/@shared/errors/non-exists-error'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'

type DeleteUserServiceRequest = {
  id: string
}

type DeleteUserServiceResponse = Either<NonExistsError, boolean>

@Injectable()
export class DeleteUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({
    id,
  }: DeleteUserServiceRequest): Promise<DeleteUserServiceResponse> {
    const user = await this.userRepository.findUserById(id)

    if (!user) {
      return left(new NonExistsError('User'))
    }

    if (user.deletedAt) {
      return left(new InactiveError('User'))
    }

    const result = await this.userRepository.deleteUser(id)

    return right(result)
  }
}
