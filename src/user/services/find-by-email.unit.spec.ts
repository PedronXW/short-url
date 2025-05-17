import { UserFactory } from 'test/factories/unit/UserFactory'
import { InMemoryUserRepository } from 'test/repositories/InMemoryUserRepository'
import { NonExistsError } from '../../@shared/errors/non-exists-error'
import { FindUserByEmailService } from './find-by-email'

let sut: FindUserByEmailService
let inMemoryUserRepository: InMemoryUserRepository

describe('Find User By Email', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FindUserByEmailService(inMemoryUserRepository)
  })

  it('should be able to find a user by email', async () => {
    const user = await UserFactory.create({})

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({ email: user.email })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.users[0].email).toEqual(user.email)
  })

  it('should be able to not find a user by email because a wrong email', async () => {
    const user = await UserFactory.create({})

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({ email: 'wrongemail@wrong.com' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NonExistsError)
  })
})
