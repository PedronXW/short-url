import { WrongCredentialsError } from '@/@shared/errors/wrong-credentials-error'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UserFactory } from 'test/factories/unit/UserFactory'
import { InMemoryUserRepository } from 'test/repositories/InMemoryUserRepository'
import { AuthenticateUserService } from './authenticate'

let sut: AuthenticateUserService
let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

describe('AuthenticateUser', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUserService(
      inMemoryUserRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a user', async () => {
    const user = await UserFactory.create({ password: 'any_password' })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({
      email: user.email,
      password: 'any_password',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveProperty('token')
  })

  it('should be able to return a wrong credential error caused by a wrong password', async () => {
    const user = await UserFactory.create({})

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({
      email: user.email,
      password: 'any',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should be able to return a wrong credential error caused by a wrong email', async () => {
    const user = await UserFactory.create({ password: 'any_password' })

    await inMemoryUserRepository.createUser(user)

    const result = await sut.execute({
      email: 'any@gmail.com',
      password: 'any_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
