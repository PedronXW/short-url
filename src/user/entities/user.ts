import { Entity } from '@/@shared/entities/entity'
import { EntityId } from '@/@shared/entities/entity-id'
import { Optional } from '@/@shared/types/optional'

export type UserProps = {
  email: string
  password: string
  active: boolean
}

export class User extends Entity<UserProps> {

  get email(): string {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get password(): string {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get active(): boolean {
    return this.props.active
  }

  set active(active: boolean) {
    this.props.active = active
  }

  static create(props: Optional<UserProps, 'active'>, id?: EntityId): User {
    const user = new User(
      {
        ...props,
        active: props.active ?? true,
      },
      id,
    )
    return user
  }
}
