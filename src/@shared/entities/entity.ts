import { DomainEvent } from '../events/domain-event'
import { EntityId } from './entity-id'

export abstract class Entity<Props> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
  }

  public clearEvents(): void {
    this._domainEvents = []
  }

  private _id: EntityId

  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: EntityId) {
    this._id = id ?? new EntityId()
    this.props = props
  }

  public equals(entity: Entity<Props>): boolean {
    if (entity === null || entity === undefined) {
      return false
    }

    if (entity === this) {
      return true
    }

    return this._id.equals(entity._id)
  }
}
