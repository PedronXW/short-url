import { randomUUID } from 'crypto'

export class EntityId {
  private value: string

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  public getValue(): string {
    return this.value
  }

  public equals(id: EntityId): boolean {
    if (id === null || id === undefined) {
      return false
    }

    if (!(id instanceof this.constructor)) {
      return false
    }

    if (id === this) {
      return true
    }

    return this.getValue() === id.value
  }
}
