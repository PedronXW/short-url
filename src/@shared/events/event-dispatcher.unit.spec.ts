import { AggregateRoot } from '../entities/aggregate-root'
import { EntityId } from '../entities/entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './event-dispatcher'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): EntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', async () => {
    const callbackSpy = jest.fn()
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)
    const aggregate = CustomAggregate.create()
    DomainEvents.markAggregateForDispatch(aggregate)
    expect(aggregate.domainEvents).toHaveLength(1)
    DomainEvents.dispatchEventsForAggregate(aggregate.id)
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
