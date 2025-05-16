import { EntityId } from '../entities/entity-id'

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): EntityId
}
