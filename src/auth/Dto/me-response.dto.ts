
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class MeResponseDto {
  @ApiProperty({ example: 200 })
  code!: number;

  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'User retrieved successfully.' })
  message!: string;

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;
}
