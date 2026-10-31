import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  @ApiProperty({ example: 200 })
  code!: number;

  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Token refreshed successfully.' })
  message!: string;

  @ApiProperty({ example: 'new_access_token' })
  accessToken!: string;

  @ApiProperty({ example: 'new_refresh_token' })
  refreshToken!: string;
}
