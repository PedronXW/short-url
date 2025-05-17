import { EntityId } from '@/@shared/entities/entity-id'
import { User } from '@/user/entities/user'

export class UserMapper {
  static toDomain(raw) {
    return User.create(
      {
        email: raw.email,
        password: raw.password,
        active: raw.active,
      },
      new EntityId(raw.id),
    )
  }

  static toPersistence(user: User) {
    return {
      id: user.id.getValue(),
      email: user.email,
      password: user.password,
      active: user.active,
    }
  }
}
