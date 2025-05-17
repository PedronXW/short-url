import { User } from '@/user/entities/user'
import {
  FindUsersResponse,
  UserRepository,
} from '@/user/repositories/user-repository'
import { Injectable } from '@nestjs/common'
import { UserMapper } from '../mappers/user-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: UserMapper.toPersistence(user),
    })

    return UserMapper.toDomain(createdUser)
  }

  async updateUser(id: string, user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: UserMapper.toPersistence(user),
    })

    return UserMapper.toDomain(updatedUser)
  }

  async deleteUser(id: string): Promise<boolean> {
    const deletedUser = await this.prisma.user.update({
      where: { id },
      data: {
        active: false,
      },
    })

    return !!deletedUser
  }

  async findUserById(id: string): Promise<User | undefined> {
    const user = await this.prisma.user.findFirst({
      where: { id },
    })

    if (!user) {
      return undefined
    }

    return UserMapper.toDomain(user)
  }

  async changePassword(id: string, password: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        password,
      },
    })

    return UserMapper.toDomain(user)
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    })

    if (!user) {
      return undefined
    }

    return UserMapper.toDomain(user)
  }

  async findUsers(page: number, limit: number): Promise<FindUsersResponse> {
    const users = await this.prisma.user.findMany({
      take: limit * 1,
      skip: (page - 1) * limit,
    })

    const total = await this.prisma.user.count()

    return {
      users: users.map(UserMapper.toDomain),
      usersCount: total,
    }
  }
}
