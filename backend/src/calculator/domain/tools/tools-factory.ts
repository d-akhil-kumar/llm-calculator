import { Injectable } from '@nestjs/common'
import { addTool } from './add.tool'
import { subtractTool } from './subtract.tool'

@Injectable()
export class ToolsFactory {
  private static calculatorTools = [addTool, subtractTool]

  private static toolsByName = {
    [addTool.name]: addTool,
    [subtractTool.name]: subtractTool,
  }

  getAllTools() {
    return ToolsFactory.calculatorTools
  }

  getToolsByName(toolNames: string[]) {
    return ToolsFactory.calculatorTools.filter((tool) =>
      toolNames.includes(tool.name),
    )
  }

  getToolByName(toolName: string) {
    return ToolsFactory.calculatorTools.find((tool) => tool.name === toolName)
  }

  getToolNames() {
    return ToolsFactory.calculatorTools.map((tool) => tool.name)
  }

  getToolsByNameMap() {
    return ToolsFactory.toolsByName
  }

  getToolsFromMap() {
    return Object.values(ToolsFactory.toolsByName)
  }
}
