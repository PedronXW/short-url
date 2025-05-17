import { HashGenerator } from '@/@shared/criptography/hash-generator'
import { Either, left, right } from '@/@shared/either'
import { AlreadyExistsError } from '@/@shared/errors/already-exists-error'
import { Injectable } from '@nestjs/common'
import { User } from '../entities/user'
import { UserRepository } from '../repositories/user-repository'

export type CreateUserServiceRequest = {
  email: string
  password: string
}

export type CreateUserServiceResponse = Either<AlreadyExistsError, User>

@Injectable()
export class CreateUserService {
  constructor(
    private UserRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    password,
  }: CreateUserServiceRequest): Promise<CreateUserServiceResponse> {
    const userAlreadyExists = await this.UserRepository.findUserByEmail(email)

    if (userAlreadyExists) {
      return left(new AlreadyExistsError('User'))
    }

    const user = User.create({
      password: await this.hashGenerator.hash(password),
      email,
    })

    return right(await this.UserRepository.createUser(user))
  }
}
