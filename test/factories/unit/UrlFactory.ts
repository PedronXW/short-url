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
        active: props.active || true,
      },
      id || new EntityId('url-id'),
    )
  }
}
