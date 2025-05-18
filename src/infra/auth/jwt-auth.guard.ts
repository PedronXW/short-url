import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from './public'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']

    if (isPublic) {
      if (authHeader?.startsWith('Bearer ')) {
        try {
          // forçamos o super.canActivate a resolver e retornar um boolean
          const result = await super.canActivate(context)
          return !!result
        } catch {
          return true // ignora token inválido
        }
      }

      return true // sem token → segue como público
    }

    // rota protegida → exige token válido
    return super.canActivate(context) as Promise<boolean>
  }
}