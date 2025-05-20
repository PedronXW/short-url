import { User } from './user'

describe('User', () => {
  it('should be able to create a new user', () => {
    const user = User.create({
      email: 'any_email',
      password: 'any_password',
    })

    expect(user.email).toBe('any_email')
    expect(user.password).toBe('any_password')
    expect(user.deletedAt).toBeUndefined()
  })
})
