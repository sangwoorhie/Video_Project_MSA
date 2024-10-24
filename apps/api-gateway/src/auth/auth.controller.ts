import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { RefreshResDto, SigninResDto, SignupResDto } from './dto/res.dto';
import { ApiPostResponse } from '../common/decorator/swagger.decorator';
import { Public } from '../common/decorator/public.decorator';
import { User } from '../common/decorator/user.decorator';
import { UserAfterAuth } from '../common/decorator/user.decorator';

@ApiTags('Auth')
@ApiExtraModels(SignupResDto, SigninResDto, RefreshResDto)
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 1. 회원가입 엔드포인트
  // POST : localhost:3000/api/auth/signup
  @ApiPostResponse(SignupResDto)
  @Public()
  @Post('signup')
  async signup(
    @Body() { email, password, passwordConfirm }: SignupReqDto,
  ): Promise<SignupResDto> {
    if (password !== passwordConfirm) throw new BadRequestException();
    const { id, accessToken, refreshToken } = await this.authService.signup(
      email,
      password,
    );
    return { id, accessToken, refreshToken };
  }

  // 2. 로그인 엔드포인트
  // POST : localhost:3000/api/auth/signin
  @ApiPostResponse(SigninResDto)
  @Public()
  @Post('signin')
  async signin(@Body() { email, password }: SigninReqDto) {
    return this.authService.signin(email, password);
  }

  // 3. 리프레시토큰 발급
  // POST : localhost:3000/api/auth/refresh
  @ApiPostResponse(RefreshResDto)
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(
    @Headers('authorization') authorization,
    @User() user: UserAfterAuth,
  ) {
    const token = /Bearer\s(.+)/.exec(authorization)[1];
    const { accessToken, refreshToken } = await this.authService.refresh(
      token,
      user.id,
    );
    return { accessToken, refreshToken };
  }
}