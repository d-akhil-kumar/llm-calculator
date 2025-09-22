import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CalculatePromptDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty({ type: String, description: 'User inputted prompt' })
  prompt: string
}
