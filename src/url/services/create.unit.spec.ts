import { EnvService } from '@/infra/env/env.service'
import { InMemoryUrlRepository } from 'test/repositories/InMemoryUrlRepository'
import { CreateUrlService } from './create'

let sut: CreateUrlService
let inMemoryUrlRepository: InMemoryUrlRepository
let envService: jest.Mocked<EnvService>

describe('Create Url', () => {
  beforeEach(() => {
    inMemoryUrlRepository = new InMemoryUrlRepository()
    envService = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
      configService: {} as any, // Mock or provide a suitable mock for ConfigService
    } as any
    sut = new CreateUrlService(
      inMemoryUrlRepository,
      envService
    )
  })

  it('should be able to create a new url', async () => {

    const response = await sut.execute({
      fullUrl: 'https://example.com',
      creator: 'any_assign_id',
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryUrlRepository.urls).toHaveLength(1)
    expect(inMemoryUrlRepository.urls[0]).toEqual(response.value)
  })
})
