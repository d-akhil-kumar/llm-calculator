import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'

export class CalculatePromptDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty({ type: String, description: 'User inputted prompt' })
  prompt: string

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Session ID to maintain conversation context',
  })
  sessionId?: number
}
