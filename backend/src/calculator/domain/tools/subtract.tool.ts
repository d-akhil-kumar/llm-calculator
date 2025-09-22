import { tool } from '@langchain/core/tools'
import { z } from 'zod'

export const subtractTool = tool(
  async (input: { a: number; b: number }) => {
    console.log(`subtract tool called on ${input.a} - ${input.b}`)
    return input.a - input.b
  },
  {
    name: 'subtract_two_numbers',
    schema: z.object({
      a: z.number().describe('First operand'),
      b: z.number().describe('Second operand'),
    }),
    description: 'Subtract the second number from the first number.',
  },
)
