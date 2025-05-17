import { EntityId } from './entity-id'

export abstract class Entity<Props> {
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
