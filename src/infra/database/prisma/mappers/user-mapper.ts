import { EntityId } from '@/@shared/entities/entity-id'
import { User } from '@/user/entities/user'

export class UserMapper {
  static toDomain(raw) {
    return User.create(
      {
        email: raw.email,
        password: raw.password,
        deletedAt: raw.deletedAt !== null ? new Date(raw.deletedAt) : undefined,
      },
      new EntityId(raw.id),
    )
  }

  static toPersistence(user: User) {
    return {
      id: user.id.getValue(),
      email: user.email,
      password: user.password,
      deletedAt: user.deletedAt ? user.deletedAt : null,
    }
  }
}
