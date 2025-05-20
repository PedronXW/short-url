import { Entity } from '@/@shared/entities/entity'
import { EntityId } from '@/@shared/entities/entity-id'
import { Optional } from '@/@shared/types/optional'

export type UserProps = {
  email: string
  password: string
  deletedAt?: Date
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

  get deletedAt(): Date | undefined {
    return this.props.deletedAt
  }

  set deletedAt(deletedAt: Date | undefined) {
    this.props.deletedAt = deletedAt
  }

  static create(props: Optional<UserProps, 'deletedAt'>, id?: EntityId): User {
    const user = new User(
      {
        ...props,
        deletedAt: props.deletedAt ?? undefined,
      },
      id,
    )
    return user
  }
}
