import { Module } from '@nestjs/common'
import { CalculatorController } from './application/controllers/calculator.controller'
import { CalculatorService } from './domain/services/calculator.service'
import { AgentService } from './domain/services/agent.serivce'
import { ToolsFactory } from './domain/tools/tools-factory'

@Module({
  imports: [],
  controllers: [CalculatorController],
  providers: [CalculatorService, AgentService, ToolsFactory],
})
export class CalculatorModule {}
