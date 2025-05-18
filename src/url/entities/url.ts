import { Entity } from '@/@shared/entities/entity'
import { EntityId } from '@/@shared/entities/entity-id'
import { Optional } from '@/@shared/types/optional'

export type UrlProps = {
  url: string
  shortened: string
  creator?: EntityId
  createdAt: Date
  updatedAt: Date
  accessCount: number
  active: boolean
}

export class Url extends Entity<UrlProps> {

  get active(): boolean {
    return this.props.active
  }

  set active(active: boolean) {
    this.props.active = active
  }

  get url(): string {
    return this.props.url
  }

  set url(url: string) {
    this.props.url = url
  }

  get shortened(): string {
    return this.props.shortened
  }

  set shortened(shortened: string) {
    this.props.shortened = shortened
  }

  get creator(): EntityId | undefined {
    return this.props.creator
  }

  set creator(creator: EntityId) {
    this.props.creator = creator
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt
  }

  get accessCount(): number {
    return this.props.accessCount
  }

  set accessCount(accessCount: number) {
    this.props.accessCount = accessCount
  }

  increaseAccessCount(): void {
    this.props.accessCount += 1
  }

  static create(
    props: Optional<UrlProps, 'active' | 'createdAt' | 'updatedAt' | 'accessCount'>,
    id?: EntityId,
  ): Url {
    const url = new Url(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        accessCount: props.accessCount ?? 0,
        active: props.active ?? true,
      },
      id,
    )
    return url
  }
}
