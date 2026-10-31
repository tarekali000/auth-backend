
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    description: 'The refresh token',
    example: 'your_refresh_token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
