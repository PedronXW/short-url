import { Url } from '@/url/entities/url'
import {
  FindUrlsResponse,
  UrlRepository,
} from '@/url/repositories/repository'
import { Injectable } from '@nestjs/common'
import { UrlMapper } from '../mappers/url-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUrlRepository implements UrlRepository {
  constructor(private prisma: PrismaService) {}

  async createUrl(data: Url): Promise<Url> {
    const createdUrl = await this.prisma.url.create({
      data: UrlMapper.toPersistence(data),
      include: {
        user: true,
      },
    })

    return UrlMapper.toDomain(createdUrl)
  }

  async findUrlById(id: string, userId: string): Promise<Url | undefined> {
    const url = await this.prisma.url.findFirst({
      where: { id, userId },
      include: {
        user: true,
      },
    })

    if (!url) {
      return undefined
    }

    return UrlMapper.toDomain(url)
  }

  async updateUrl(id: string, editedUrl: Url): Promise<Url> {
    const updatedUrl = await this.prisma.url.update({
      where: { id },
      data: UrlMapper.toPersistence(editedUrl),
      include: {
        user: true,
      },
    })

    return UrlMapper.toDomain(updatedUrl)
  }

  async findUrlByShortened(shortened: string, creator?: string): Promise<Url | undefined> {
    const url = await this.prisma.url.findFirst({
      where: { shortened, active: true, userId: creator },
      include: {
        user: true,
      },
    })
    
    if (!url) {
      return undefined
    }

    return UrlMapper.toDomain(url)
  }

  async deleteUrl(id: string): Promise<boolean> {
    const deletedUrl = await this.prisma.url.update({
      where: { id },
      data: { active: false },
    })

    return !!deletedUrl
  }

  async findUrls(
    page: number,
    limit: number,
    userId: string,
  ): Promise<FindUrlsResponse> {
    const urls = await this.prisma.url.findMany({
      where: {
        active: true,
        userId,
      },
      include: {
        user: true,
      },
      take: limit * 1,
      skip: (page - 1) * limit,
    })

    const total = await this.prisma.url.count({
      where: {
        active: true,
        userId,
      },
    })

    return {
      urls: urls.map(UrlMapper.toDomain),
      urlsCount: total,
    }
  }
}
