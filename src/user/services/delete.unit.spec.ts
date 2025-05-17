import { InMemoryUserRepository } from 'test/repositories/InMemoryUserRepository'
import { NonExistsError } from '../../@shared/errors/non-exists-error'
import { User } from '../entities/user'
import { DeleteUserService } from './delete'

let sut: DeleteUserService
let inMemoryUserRepository: InMemoryUserRepository

describe('DeleteUser', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new DeleteUserService(inMemoryUserRepository)
  })

  it('should be able to delete a user', async () => {
    const user = User.create({
      email: 'anyemail@email.com',
      password: 'any_password',
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({
      id: user.id.getValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.users).toHaveLength(0)
  })

  it('should be able to not delete a user because a wrong id', async () => {
    const user = User.create({
      email: 'anyemail@email.com',
      password: 'any_password',
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({
      id: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NonExistsError)
    expect(inMemoryUserRepository.users).toHaveLength(1)
  })
})
