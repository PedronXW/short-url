import { User } from '@/user/entities/user'
import { UserRepository } from '@/user/repositories/user-repository'

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = []

  async createUser(user: User): Promise<User> {
    this.users.push(user)
    return user
  }

  async findUserById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id.getValue() === id)
  }

  async changePassword(id: string, password: string): Promise<User> {
    const userIndex = this.users.findIndex((c) => c.id.getValue() === id)

    this.users[userIndex].password = password

    return this.users[userIndex]
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((c) => c.email === email)

    if (!user) return undefined

    return user
  }

  async updateUser(id: string, editedUser: User): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id.getValue() === id)

    this.users[userIndex] = editedUser

    return editedUser
  }

  async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex((user) => user.id.getValue() === id)

    this.users.splice(userIndex, 1)

    return this.users.findIndex((user) => user.id.getValue() === id) === -1
  }
}
