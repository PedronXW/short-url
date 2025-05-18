import { UrlFactory } from 'test/factories/unit/UrlFactory'
import { InMemoryUrlRepository } from 'test/repositories/InMemoryUrlRepository'
import { PaginationError } from '../../@shared/errors/pagination-error'
import { FindUrlsService } from './find'

let sut: FindUrlsService
let inMemoryUrlRepository: InMemoryUrlRepository

describe('Find Url By Id', () => {
  beforeEach(() => {
    inMemoryUrlRepository = new InMemoryUrlRepository()
    sut = new FindUrlsService(inMemoryUrlRepository)
  })

  it('should be able to find a url by id', async () => {
    const url = UrlFactory.create({})

    await inMemoryUrlRepository.createUrl(url)

    if(!url.creator) {
      throw new Error('Url creator is not defined')
    }

    const response = await sut.execute({
      limit: 10,
      page: 1,
      userId: url.creator.getValue(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      urls: [expect.objectContaining({ id: url.id })],
      urlsCount: 1,
    })
  })

  it('should not be able to find a url that does not exist', async () => {
    const response = await sut.execute({
      limit: 10,
      page: 1,
      userId: 'user-id',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      urls: [],
      urlsCount: 0,
    })
  })

  it('should not be able to find a url because a pagination error', async () => {
    const response = await sut.execute({
      limit: 10,
      page: 0,
      userId: 'user-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(PaginationError)
  })
})
