import { HashGenerator } from '@/@shared/criptography/hash-generator'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { InMemoryUserRepository } from 'test/repositories/InMemoryUserRepository'
import { CreateUserService } from './create'

let sut: CreateUserService
let inMemoryUserRepository: InMemoryUserRepository
let hashGenerator: HashGenerator

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    hashGenerator = new BcryptHasher()
    sut = new CreateUserService(inMemoryUserRepository, hashGenerator)
  })

  it('should be able to create a new user', async () => {
    const response = await sut.execute({
      email: 'anyemail@email.com',
      password: 'any_password',
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryUserRepository.users).toHaveLength(1)
    expect(inMemoryUserRepository.users[0]).toEqual(response.value)
  })
})
