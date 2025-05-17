import { User } from '@/user/entities/user'

export type UserHTTP = {
  id: string
  email: string
  active: boolean
}

export class UserPresenter {
  static toHTTP(user: User): UserHTTP {
    return {
      id: user.id.getValue(),
      email: user.email,
      active: user.active,
    }
  }
}
