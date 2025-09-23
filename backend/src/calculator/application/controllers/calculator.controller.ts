import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CalculatorService } from 'src/calculator/domain/services/calculator.service'
import { CalculatePromptDto } from '../dtos/calculate-prompt.dto'
import { BaseMessage } from '@langchain/core/messages'
import { AgentService } from 'src/calculator/domain/services/agent.serivce'
const conversationHistoryStore: Record<string, BaseMessage[]> = {}

@ApiTags('LLM Calculator')
@Controller('/calculator')
export class CalculatorController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  async calculate(
    @Body() calculatePromptDto: CalculatePromptDto,
  ): Promise<{ reply: string }> {
    console.log(calculatePromptDto)
    const { prompt, sessionId = 1 } = calculatePromptDto

    // Retrieve history for this session, or start a new one
    const history = conversationHistoryStore[sessionId] ?? []

    // Run the agent with the prompt and history
    const result = await this.agentService.run(prompt, history)

    // Update the history for the session
    conversationHistoryStore[sessionId] = result.fullHistory

    // Return the agent's direct response to the user
    return {
      reply: result.response,
    }
  }
}
