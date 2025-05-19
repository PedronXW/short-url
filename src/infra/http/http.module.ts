import { EnvModule } from '@/infra/env/env.module'
import { CreateUrlService } from '@/url/services/create'
import { DeleteUrlService } from '@/url/services/delete'
import { FindUrlsService } from '@/url/services/find'
import { FindUrlByIdService } from '@/url/services/find-by-id'
import { FindUrlByShortenedService } from '@/url/services/redirect'
import { UpdateUrlService } from '@/url/services/update'
import { AuthenticateUserService } from '@/user/services/authenticate'
import { ChangePasswordService } from '@/user/services/change-password'
import { CreateUserService } from '@/user/services/create'
import { DeleteUserService } from '@/user/services/delete'
import { FindUserByIdService } from '@/user/services/find-by-id'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptograpy.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateUserController } from './controllers/authentication/authenticate-user-controller'
import { HealthController } from './controllers/health/health.controller'
import { RedirectUrlController } from './controllers/redirect/redirect'
import { CreateUrlController } from './controllers/url/create/create'
import { DeleteUrlController } from './controllers/url/delete/delete'
import { FindUrlByIdController } from './controllers/url/find-by-id/find-by-id'
import { FindUrlsController } from './controllers/url/find/find'
import { UpdateUrlController } from './controllers/url/update/update'
import { ChangePasswordController } from './controllers/user/change-password/change-password'
import { CreateUserController } from './controllers/user/create/create'
import { DeleteUserController } from './controllers/user/delete/delete'

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  controllers: [
    AuthenticateUserController,
    ChangePasswordController,
    CreateUserController,
    DeleteUserController,
    CreateUrlController,
    DeleteUrlController,
    UpdateUrlController,
    FindUrlByIdController,
    FindUrlsController,
    HealthController,
    RedirectUrlController
  ],
  providers: [
    AuthenticateUserService,
    ChangePasswordService,
    CreateUserService,
    DeleteUserService,
    FindUserByIdService,
    CreateUrlService,
    FindUrlByIdService,
    FindUrlsService,
    DeleteUrlService,
    UpdateUrlService,
    FindUrlByShortenedService
  ],
})
export class HttpModule {}
