import { UserFactory } from 'test/factories/unit/UserFactory'
import { UserPresenter } from './presenter'

describe('PresenterUser', () => {
  it('should be manipulate a user to a http response', async () => {
    // Arrange
    const user = await UserFactory.create({})

    const httpResponse = UserPresenter.toHTTP(user)

    expect(httpResponse).toEqual({
      id: user.id.getValue(),
      email: user.email,
      active: user.active,
    })
  })
})
