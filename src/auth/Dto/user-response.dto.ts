import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id!: string;

  @ApiProperty({ example: 'tarek' })
  username!: string;

  @ApiProperty({ example: 'tarek@example.com' })
  email!: string;
}
