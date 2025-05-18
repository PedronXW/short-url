import { UrlRepository } from '@/url/repositories/repository'
import { UserRepository } from '@/user/repositories/user-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaUrlRepository } from './prisma/repositories/prisma-url-repository'
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository'

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: UrlRepository,
      useClass: PrismaUrlRepository
    }
  ],
  exports: [
    PrismaService,
    UserRepository,
    UrlRepository
  ],
})
export class DatabaseModule {}
