import { UrlFactory } from 'test/factories/unit/UrlFactory'
import { InMemoryUrlRepository } from 'test/repositories/InMemoryUrlRepository'
import { NonExistsError } from '../../@shared/errors/non-exists-error'
import { DeleteUrlService } from './delete'

let sut: DeleteUrlService
let inMemoryUrlRepository: InMemoryUrlRepository

describe('DeleteUrl', () => {
  beforeEach(() => {
    inMemoryUrlRepository = new InMemoryUrlRepository()
    sut = new DeleteUrlService(inMemoryUrlRepository)
  })

  it('should be able to delete a url', async () => {
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
    expect(inMemoryUrlRepository.urls).toHaveLength(0)
  })

  it('should be able to not delete a url because a wrong id', async () => {
    const url = UrlFactory.create({})

    await inMemoryUrlRepository.createUrl(url)

    if(!url.creator) {
      throw new Error('Url creator is not defined')
    }

    const result = await sut.execute({
      id: 'wrong-id',
      userId: url.creator.getValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NonExistsError)
    expect(inMemoryUrlRepository.urls).toHaveLength(1)
  })

  it('should be able to not delete a url because a wrong user id', async () => {
    const url = UrlFactory.create({})

    await inMemoryUrlRepository.createUrl(url)

    const result = await sut.execute({
      id: url.id.getValue(),
      userId: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NonExistsError)
    expect(inMemoryUrlRepository.urls).toHaveLength(1)
  })
})
