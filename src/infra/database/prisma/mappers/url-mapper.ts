import { EntityId } from '@/@shared/entities/entity-id'
import { Url } from '@/url/entities/url'

export class UrlMapper {
  static toDomain(raw) {
    return Url.create(
      {
        creator: raw.user ? new EntityId(raw.user.id): undefined,
        url: raw.url,
        shortened: raw.shortened,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        accessCount: raw.accessCount,
        deletedAt: raw.deletedAt !== null ? new Date(raw.deletedAt) : undefined,
      },
      new EntityId(raw.id),
    )
  }

  static toPersistence(data: Url) {
    return {
      id: data.id.getValue(),
      url: data.url,
      shortened: data.shortened,
      accessCount: data.accessCount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt ? data.deletedAt : null,
      ...(data.creator && {
        user: {
          connect: {
            id: data.creator.getValue(),
          },
        },
      }),
    }
  }
}
