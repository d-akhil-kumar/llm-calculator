import { Injectable } from '@nestjs/common'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { ToolsFactory } from '../tools/tools-factory'
import { ConfigService } from '@nestjs/config'
import { AgentState, ToolNode } from '@langchain/langgraph/prebuilt'
import { BaseMessage, HumanMessage, AIMessage } from '@langchain/core/messages'
import { MessagesAnnotation, StateGraph } from '@langchain/langgraph'
import { Runnable } from '@langchain/core/runnables'
import { BaseLanguageModelInput } from '@langchain/core/language_models/base'

@Injectable()
export class AgentService {
  private model: Runnable<BaseLanguageModelInput, AIMessage>
  private tools: any[]
  private toolNode: ToolNode<any>
  private agentExecutor: any

  constructor(
    private readonly configService: ConfigService,
    private readonly toolsFactory: ToolsFactory,
  ) {
    this.tools = this.toolsFactory.getAllTools()
    this.model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: this.configService.get<string>('LLM_MODEL_API_KEY'),
      temperature: 0,
    }).bindTools(this.tools)

    this.toolNode = new ToolNode(this.tools)

    const workflow = new StateGraph(MessagesAnnotation)
      .addNode('agent', this.callModel.bind(this))
      .addEdge('__start__', 'agent')
      .addNode('tools', this.toolNode)
      .addEdge('tools', 'agent')
      .addConditionalEdges('agent', this.shouldContinue.bind(this))

    // Finally, we compile it into a LangChain Runnable.
    this.agentExecutor = workflow.compile()
  }

  public async run(
    prompt: string,
    history: BaseMessage[] = [],
  ): Promise<{ response: string; fullHistory: BaseMessage[] }> {
    // Combine history with the new user message
    const messages: BaseMessage[] = [...history, new HumanMessage(prompt)]

    // Invoke the agent with the current state
    const finalState = await this.agentExecutor.invoke({ messages })

    // Extract the last message, which is the AI's final response
    const lastMessage = finalState.messages[finalState.messages.length - 1]

    if (!lastMessage || typeof lastMessage.content !== 'string') {
      throw new Error('Agent failed to produce a valid response.')
    }

    return {
      response: lastMessage.content,
      fullHistory: finalState.messages,
    }
  }

  private shouldContinue({
    messages,
  }: typeof MessagesAnnotation.State): 'tools' | '__end__' {
    const lastMessage = messages[messages.length - 1] as AIMessage

    // If the LLM makes a tool call, then we route to the "tools" node
    if (lastMessage.tool_calls?.length) {
      return 'tools'
    }
    // Otherwise, we stop (reply to the user) using the special "__end__" node
    return '__end__'
  }

  private async callModel(
    state: typeof MessagesAnnotation.State,
  ): Promise<Partial<AgentState>> {
    const response = await this.model.invoke(state.messages)

    // We return a list, because this will get added to the existing list
    return { messages: [response] }
  }
}
