import { Url } from '@/url/entities/url'

export type UrlHTTP = {
  id: string
  url: string
  shortUrl: string
  createdAt: Date
  updatedAt: Date
  accessCount: number
  deletedAt?: Date
  userId?: string
}

export class UrlPresenter {
  static toHTTP(url: Url): UrlHTTP {
    return {
      id: url.id.getValue(),
      url: url.url,
      shortUrl: url.shortened,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      accessCount: url.accessCount,
      deletedAt: url.deletedAt,
      userId: url.creator ? url.creator.getValue(): undefined,
    }
  }
}
