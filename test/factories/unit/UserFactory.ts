import { EntityId } from '@/@shared/entities/entity-id'
import { User, UserProps } from '@/user/entities/user'
import { FakeHasher } from 'test/cryptography/fake-hasher'

export class UserFactory {
  static async create(props: Partial<UserProps>, id?: EntityId) {
    const fakeHasher = new FakeHasher()
    return User.create(
      {
        email: props.email || 'any_email@email.com',
        password: await fakeHasher.hash(props?.password || 'any_password'),
        active: props.active || true,
      },
      id || new EntityId('user-id'),
    )
  }
}
