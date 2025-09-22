import { Injectable } from '@nestjs/common'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { ToolsFactory } from '../tools/tools-factory'
import { ConfigService } from '@nestjs/config'
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { BaseMessage, HumanMessage, AIMessage } from '@langchain/core/messages'

@Injectable()
export class AgentService {
  private model: ChatGoogleGenerativeAI
  private tools: any[]

  constructor(
    private readonly configService: ConfigService,
    private readonly toolsFactory: ToolsFactory,
  ) {
    this.model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: this.configService.get<string>('LLM_MODEL_API_KEY'),
      temperature: 0,
    })
    this.tools = this.toolsFactory.getAllTools()
  }

  async createCalculatorAgent() {
    const agent = createReactAgent({
      llm: this.model,
      tools: this.tools,
      messageModifier: `You are a helpful calculator assistant. 

                        IMPORTANT GREETING BEHAVIOR:
                        - Always start with a friendly greeting when you receive the first message
                        - Introduce yourself as a calculator assistant
                        - List the available operations (addition and subtraction)
                        - Ask what calculation the user would like to perform

                        Available tools:
                        - add_two_numbers: Add two numbers together
                        - subtract_two_numbers: Subtract one number from another

                        When a user asks for calculations:
                        1. Use the appropriate tool to perform the calculation
                        2. Provide a clear result
                        3. Ask if they need any other calculations

                        If the user says goodbye or indicates they're done, respond appropriately and end the conversation.`,
    })

    return agent
  }
}
