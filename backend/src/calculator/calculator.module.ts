import { Module } from '@nestjs/common'
import { CalculatorController } from './application/controllers/calculator.controller'
import { CalculatorService } from './domain/services/calculator.service'

@Module({
  imports: [],
  controllers: [CalculatorController],
  providers: [CalculatorService],
})
export class CalculatorModule {}
