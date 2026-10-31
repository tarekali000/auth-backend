import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './Dto/register.dto';
import { LoginDto } from './Dto/login.dto';
import { MeResponseDto } from './Dto/me-response.dto';
import { RefreshResponseDto } from './Dto/refresh-response.dto';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private servies: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 200, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'The user is already taken.' })
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    const { code, ...response } = await this.servies.register(body);

    return res.status(code).send(response);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async login(@Body() body: LoginDto, @Res() res: Response) {
    let { code, accessToken, refreshToken, ...response } =
      (await this.servies.login(body)) as any;

    if (accessToken && refreshToken) {
      return res
        .status(code)
        .cookie('Auth', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        })
        .cookie('Refresh', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .send(response);
    }

    return res.status(code).send(response);
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiCookieAuth('Refresh')
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully.',
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token.',
  })
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.Refresh;

    if (!refreshToken) {
      return res.status(401).send({
        code: 401,
        success: false,
        message: 'Refresh token is required.',
      });
    }

    let {
      code,
      accessToken,
      refreshToken: newRefreshToken,
      ...response
    } = (await this.servies.refresh(refreshToken)) as any;

    if (accessToken && newRefreshToken) {
      return res
        .status(code)
        .cookie('Auth', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        })
        .cookie('Refresh', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .send(response);
    }

    return res.status(code).send(response);
  }

  @Get('/users/me')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('Auth')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    type: MeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  async getMe(
    @Req() req: Request & { user: { userId: string } },
    @Res() res: Response,
  ) {
    const { code, ...response } = await this.servies.getMe(req.user.userId);

    return res.status(code).send(response);
  }
}
