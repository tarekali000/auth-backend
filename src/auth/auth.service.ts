import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './auth.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './Dto/register.dto';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { LoginDto } from './Dto/login.dto';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  async register(body: RegisterDto) {
    let check = await this.user.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });

    if (check)
      return {
        code: 400,
        success: false,
        message: 'The user is already taken.',
      };

    check = new this.user({ ...body });
    check.password = hashSync(body.password, genSaltSync(11));

    await check.save();

    return {
      code: 200,
      success: true,
      message: 'User registered successfully.',
    };
  }

  async login(body: LoginDto) {
    const check1 = await this.user.findOne({ email: body.email });

    if (!check1)
      return {
        code: 400,
        success: false,
        message: 'The Error in login user.',
      };

    if (!compareSync(body.password, check1.password))
      return {
        code: 400,
        success: false,
        message: 'The Error in login user.',
      };

    return {
      code: 200,
      success: true,
      message: 'Done Login user.',
      ...this.genTokens(check1._id.toHexString()),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const { userId } = verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY!,
      ) as any;

      const check = await this.user.findById(userId);

      if (!check)
        return {
          code: 401,
          success: false,
          message: 'User not found.',
        };

      return {
        code: 200,
        success: true,
        message: 'Token refreshed successfully.',
        ...this.genTokens(userId),
      };
    } catch {
      return {
        code: 401,
        success: false,
        message: 'Invalid or expired refresh token.',
      };
    }
  }

  async getMe(userId: string) {
    const user = await this.user.findById(userId).select('-password');

    if (!user)
      return {
        code: 404,
        success: false,
        message: 'User not found.',
      };

    return {
      code: 200,
      success: true,
      message: 'User retrieved successfully.',
      user,
    };
  }
  private genTokens(userId: string) {
    return {
      accessToken: sign({ userId }, process.env.JWT_KEY!, {
        expiresIn: '15m',
      }),
      refreshToken: sign({ userId }, process.env.JWT_REFRESH_KEY!, {
        expiresIn: '7d',
      }),
    };
  }
}
