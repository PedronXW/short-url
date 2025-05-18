import { EnvService } from '@/env/env.service'
import { UrlFactory } from 'test/factories/unit/UrlFactory'
import { InMemoryUrlRepository } from 'test/repositories/InMemoryUrlRepository'
import { FindUrlByShortenedService } from './redirect'

let sut: FindUrlByShortenedService
let inMemoryUrlRepository: InMemoryUrlRepository
let envService: jest.Mocked<EnvService>

describe('Find Url By ID', () => {
  beforeEach(() => {
    inMemoryUrlRepository = new InMemoryUrlRepository()
    envService = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
      configService: {} as any, // Mock or provide a suitable mock for ConfigService
    } as any
    sut = new FindUrlByShortenedService(inMemoryUrlRepository, envService)
  })

  it('should be able to find a url by shortened', async () => {
    const url = UrlFactory.create({
      shortened: 'http://localhost:3000/shortened-url',
    })

    await inMemoryUrlRepository.createUrl(url)

    if(!url.creator) {
      throw new Error('Url creator is not defined')
    }

    const result = await sut.execute({
      shortened: 'shortened-url',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUrlRepository.urls[0].id).toEqual(url.id)
  })
})
