import { User } from '@/user/entities/user'

export type UserHTTP = {
  id: string
  email: string
  deletedAt?: Date
}

export class UserPresenter {
  static toHTTP(user: User): UserHTTP {
    return {
      id: user.id.getValue(),
      email: user.email,
      deletedAt: user.deletedAt,
    }
  }
}
