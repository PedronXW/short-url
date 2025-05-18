import { UrlFactory } from 'test/factories/unit/UrlFactory'
import { InMemoryUrlRepository } from 'test/repositories/InMemoryUrlRepository'
import { NonExistsError } from '../../@shared/errors/non-exists-error'
import { UpdateUrlService } from './update'

let sut: UpdateUrlService
let inMemoryUrlRepository: InMemoryUrlRepository

describe('UpdateUrl', () => {
  beforeEach(() => {
    inMemoryUrlRepository = new InMemoryUrlRepository()
    sut = new UpdateUrlService(inMemoryUrlRepository)
  })

  it('should be able to update a url', async () => {
    const url = UrlFactory.create({})

    await inMemoryUrlRepository.createUrl(url)

    if(!url.creator) {
      throw new Error('Url creator is not defined')
    }

    const result = await sut.execute({
      id: url.id.getValue(),
      baseUrl: url.url,
      creator: url.creator.getValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUrlRepository.urls).toHaveLength(1)
    expect(inMemoryUrlRepository.urls[0].id).toEqual(url.id)
    expect(inMemoryUrlRepository.urls[0].url).toEqual(url.url)
  })

  it('should be able to not update a url because a wrong id', async () => {
    const url = UrlFactory.create({})

    await inMemoryUrlRepository.createUrl(url)

    if(!url.creator) {
      throw new Error('Url creator is not defined')
    }

    const result = await sut.execute({
      id: 'wrong-id',
      creator: url.creator.getValue(),
      baseUrl: url.url,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NonExistsError)
    expect(inMemoryUrlRepository.urls).toHaveLength(1)
    expect(inMemoryUrlRepository.urls[0].url).toEqual(url.url)
  })

  it('should be able to not update a url because a wrong user id', async () => {
    const url = UrlFactory.create({})

    await inMemoryUrlRepository.createUrl(url)

    if(!url.creator) {
      throw new Error('Url creator is not defined')
    }

    const result = await sut.execute({
      id: url.id.getValue(),
      creator: url.creator.getValue() + 'wrong',
      baseUrl: url.url,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NonExistsError)
    expect(inMemoryUrlRepository.urls).toHaveLength(1)
    expect(inMemoryUrlRepository.urls[0].url).toEqual(url.url)
  })
})
