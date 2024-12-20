import {
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    LoggerService,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { JwtService } from '@nestjs/jwt';
  import { AuthGuard } from '@nestjs/passport';
  import { Observable } from 'rxjs';
  import { IS_PUBLIC_KEY } from '../common/decorator/public.decorator';
  import { ROLES_KEY } from '../common/decorator/role.decorator';
  import { Role } from 'src/user/enum/user.enum';
  import { UserService } from '../user/user.service';
  
  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
      private reflector: Reflector,
      private jwtService: JwtService,
      private userService: UserService,
      @Inject(Logger) private logger: LoggerService,
    ) {
      super();
    }
  
    // 요청에 대한 인증 및 권한 검사
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return true;
      }
  
      const http = context.switchToHttp();
      const { url, headers } = http.getRequest<Request>();
  
      const authorization = headers['authorization'];
      if (!authorization) throw new UnauthorizedException();
      if (!authorization.includes('Bearer')) throw new UnauthorizedException();
  
      const token = /Bearer\s(.+)/.exec(authorization)[1];
      if (!token) throw new UnauthorizedException('accessToken is required');
  
      const decoded = this.jwtService.decode(token);
      if (url !== '/api/auth/refresh' && decoded['tokenType'] === 'refresh') {
        const error = new UnauthorizedException('accessToken is required');
        this.logger.error(error.message, error.stack);
        throw error;
      }
  
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (requiredRoles) {
        const userId = decoded['sub'];
         // 관리자 권한 확인 (동기 통신, TCP 사용)
        return this.userService.checkUserIsAdmin(userId);
      }
  
      return super.canActivate(context);
    }
  }
  