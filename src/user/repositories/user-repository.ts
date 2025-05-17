import { User } from '../entities/user'

export type FindUsersResponse = {
  users: User[]
  usersCount: number
}

export abstract class UserRepository {
  abstract createUser(user: User): Promise<User>
  abstract updateUser(id: string, user: User): Promise<User>
  abstract changePassword(id: string, password: string): Promise<User>
  abstract deleteUser(id: string): Promise<boolean>
  abstract findUserById(id: string): Promise<User | undefined>
  abstract findUserByEmail(email: string): Promise<User | undefined>
}
