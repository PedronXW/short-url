import { EntityId } from '@/@shared/entities/entity-id'
import { Url } from '@/url/entities/url'
import { UrlMapper } from './url-mapper'

describe('UrlMapper', () => {
  it('should map from raw to domain', () => {
    // Arrange
    const raw = {
      id: '1',
      user: {
        id: 'any_user_id',
      },
      shortened: 'shortened-url',
      url: 'https://example.com',
      createdAt: new Date(),
      accessCount: 0,
      updatedAt: new Date(),
      active: true,
    }

    // Act
    const result = UrlMapper.toDomain(raw)

    // Assert
    expect(result).toEqual(
      Url.create(
        {
          creator: new EntityId('any_user_id'),
          url: 'https://example.com',
          shortened: 'shortened-url',
          createdAt: raw.createdAt,
          accessCount: 0,
          updatedAt: raw.updatedAt,
          active: true,
        },
        new EntityId('1'),
      ),
    )
  })

  it('should map from domain to persistence', () => {
    // Arrange
    const url = Url.create(
      {
        shortened: 'shortened-url',
        url: 'https://example.com',
        active: true,
        creator: new EntityId('any_assign_id'),
      },
      new EntityId('1'),
    )

    // Act
    const result = UrlMapper.toPersistence(url)

    // Assert
    expect(result).toEqual({
      id: '1',
      url: 'https://example.com',
      shortened: 'shortened-url',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      accessCount: 0,
      active: true,
      user: {
        connect: {
          id: 'any_assign_id',
        },
      },
    })
  })
})
