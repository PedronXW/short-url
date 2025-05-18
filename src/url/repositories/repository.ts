import { Url } from '../entities/url'

export type FindUrlsResponse = {
  urls: Url[]
  urlsCount: number
}

export abstract class UrlRepository {
  abstract createUrl(data: Url): Promise<Url>
  abstract findUrlById(id: string, userId: string): Promise<Url | undefined>
  abstract updateUrl(id: string, editedUrl: Url): Promise<Url>
  abstract deleteUrl(id: string): Promise<boolean>
  abstract findUrlByShortened(
    shortened: string,
    creator?: string,
  ): Promise<Url | undefined>
  abstract findUrls(
    page: number,
    limit: number,
    receiverId: string,
  ): Promise<FindUrlsResponse>
}
