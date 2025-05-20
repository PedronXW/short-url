import { UrlFactory } from 'test/factories/unit/UrlFactory'
import { UrlPresenter } from './presenter-url'

describe('PresenterUrl', () => {
  it('should be manipulate a url to a http response', async () => {
    // Arrange
    const url = UrlFactory.create({})

    const httpResponse = UrlPresenter.toHTTP(url)

    expect(httpResponse).toEqual({
      id: url.id.getValue(),
      url: url.url,
      shortUrl: url.shortened,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      accessCount: 0,
      deletedAt: url.deletedAt,
      userId: url.creator?.getValue(),
    })
  })
})
