import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class TestConnectionResponseDto {
  @ApiProperty({
    description: 'Whether the connection test was successful',
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: 'Detailed message about the test result',
    example: 'Connection test successful',
  })
  @IsString()
  message: string;
}
