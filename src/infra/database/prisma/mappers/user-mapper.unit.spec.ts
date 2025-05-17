import { EntityId } from '@/@shared/entities/entity-id'
import { User } from '@/user/entities/user'
import { UserMapper } from './user-mapper'

describe('UserMapper', () => {
  it('should map from raw to domain', () => {
    // Arrange
    const raw = {
      id: '1',
      email: 'any_email',
      password: 'any_password',
      active: true,
    }

    // Act
    const result = UserMapper.toDomain(raw)

    // Assert
    expect(result).toEqual(
      User.create(
        {
          email: 'any_email',
          password: 'any_password',
          active: true,
        },
        new EntityId('1'),
      ),
    )
  })

  it('should map from domain to persistence', () => {
    // Arrange
    const user = User.create(
      {
        email: 'any_email',
        password: 'any_password',
        active: true,
      },
      new EntityId('1'),
    )

    // Act
    const result = UserMapper.toPersistence(user)

    // Assert
    expect(result).toEqual({
      id: '1',
      email: 'any_email',
      password: 'any_password',
      active: true,
    })
  })
})
