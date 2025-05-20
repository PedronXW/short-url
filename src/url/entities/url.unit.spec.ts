import { EntityId } from '@/@shared/entities/entity-id'
import { Url } from './url'

describe('Url', () => {
  it('should be able to create a new url', () => {
    const url = Url.create({
      url: 'https://example.com',
      shortened: 'shortened-url',
    })

    expect(url).toBeInstanceOf(Url)
    expect(url.id).toBeInstanceOf(EntityId)
    expect(url.url).toBe('https://example.com')
    expect(url.shortened).toBe('shortened-url')
    expect(url.deletedAt).toBe(undefined)
  })
})
