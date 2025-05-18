import { UrlFactory } from 'test/factories/unit/UrlFactory'
import { InMemoryUrlRepository } from 'test/repositories/InMemoryUrlRepository'
import { NonExistsError } from '../../@shared/errors/non-exists-error'
import { FindUrlByIdService } from './find-by-id'

let sut: FindUrlByIdService
let inMemoryUrlRepository: InMemoryUrlRepository

describe('Find Url By ID', () => {
  beforeEach(() => {
    inMemoryUrlRepository = new InMemoryUrlRepository()
    sut = new FindUrlByIdService(inMemoryUrlRepository)
  })

  it('should be able to find a url by id', async () => {
    const url = UrlFactory.create({})

    await inMemoryUrlRepository.createUrl(url)

    if(!url.creator) {
      throw new Error('Url creator is not defined')
    }

    const result = await sut.execute({
      id: url.id.getValue(),
      userId: url.creator.getValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUrlRepository.urls[0].id).toEqual(url.id)
  })

  it('should be able to not find a url because a wrong id', async () => {
    const url = UrlFactory.create({})

    await inMemoryUrlRepository.createUrl(url)

    if(!url.creator) {
      throw new Error('Url creator is not defined')
    }

    const result = await sut.execute({
      id: 'wrong id',
      userId: url.creator.getValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NonExistsError)
  })

  it('should be able to not find a url because a wrong user id', async () => {
    const url = UrlFactory.create({})

    await inMemoryUrlRepository.createUrl(url)

    const result = await sut.execute({
      id: url.id.getValue(),
      userId: 'wrong id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NonExistsError)
  })
})
