import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CalculatorService } from 'src/calculator/domain/services/calculator.service'
import { CalculatePromptDto } from '../dtos/calculate-prompt.dto'

@ApiTags('LLM Calculator')
@Controller('/calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post()
  async calculate(
    @Body() calculatePromptDto: CalculatePromptDto,
  ): Promise<String> {
    console.log(calculatePromptDto)
    return 'hello'
  }
}
