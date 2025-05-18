import { Url } from '@/url/entities/url'
import {
  FindUrlsResponse,
  UrlRepository,
} from '@/url/repositories/repository'

export class InMemoryUrlRepository implements UrlRepository {
  public urls: Url[] = []

  async createUrl(url: Url): Promise<Url> {
    this.urls.push(url)
    return url
  }

  async findUrlByShortened(
    shortened: string,
    creator?: string,
  ): Promise<Url | undefined> {
    return this.urls.find(
      (url) =>
        url.shortened === shortened &&
        (!creator || url.creator?.getValue() === creator),
    )
  }

  async findUrlById(
    id: string,
    userId: string,
  ): Promise<Url | undefined> {
    return this.urls.find(
      (url) =>
        url.id.getValue() === id && url.creator && url.creator.getValue() === userId,
    )
  }

  async updateUrl(id: string, editedUrl: Url): Promise<Url> {
    const urlIndex = this.urls.findIndex(
      (url) => url.id.getValue() === id,
    )

    this.urls[urlIndex] = editedUrl

    return editedUrl
  }

  async deleteUrl(id: string): Promise<boolean> {
    const urlIndex = this.urls.findIndex(
      (url) => url.id.getValue() === id,
    )

    this.urls.splice(urlIndex, 1)

    return (
      this.urls.findIndex((url) => url.id.getValue() === id) === -1
    )
  }

  async findUrls(
    page: number,
    limit: number,
    userId: string,
  ): Promise<FindUrlsResponse> {
    const startIndex = (page - 1) * limit

    const endIndex = page * limit

    return {
      urls: this.urls
        .filter((url) => url.creator && url.creator.getValue() === userId)
        .slice(startIndex, endIndex),
      urlsCount: this.urls.filter(
        (url) => url.creator && url.creator.getValue() === userId,
      ).length,
    }
  }
}
