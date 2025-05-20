import { EntityId } from '@/@shared/entities/entity-id'
import { Url, UrlProps } from '@/url/entities/url'

export class UrlFactory {
  static create(props: Partial<UrlProps>, id?: EntityId) {
    return Url.create(
      {
        url: props.url || 'https://example.com',
        shortened: props.shortened || 'shortened-url',
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
        creator: props.creator || new EntityId('creator-id'),
        accessCount: props.accessCount || 0,
        deletedAt: props.deletedAt || undefined,
      },
      id || new EntityId('url-id'),
    )
  }
}
