import { UserFactory } from 'test/factories/unit/UserFactory'
import { InMemoryUserRepository } from 'test/repositories/InMemoryUserRepository'
import { NonExistsError } from '../../@shared/errors/non-exists-error'
import { FindUserByIdService } from './find-by-id'

let sut: FindUserByIdService
let inMemoryUserRepository: InMemoryUserRepository

describe('Find User By ID', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FindUserByIdService(inMemoryUserRepository)
  })

  it('should be able to find a user by id', async () => {
    const user = await UserFactory.create({
      email: 'anyemail@email.com',
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({
      id: user.id.getValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.users[0].id).toEqual(user.id)
  })

  it('should be able to not find a user because a wrong id', async () => {
    const user = await UserFactory.create({
      email: 'anyemail@email.com',
    })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({
      id: 'wrong id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NonExistsError)
  })
})
