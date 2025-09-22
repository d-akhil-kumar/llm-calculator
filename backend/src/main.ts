import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'

const logger = new Logger('main.ts:bootstrap')

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {})

  const configService = app.get(ConfigService)
  const PORT = configService.get<number>('PORT', 3000)

  app.setGlobalPrefix('')
  app.use(helmet())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  await app.listen(PORT)

  logger.debug(`Server is running on port: ${PORT}`)
}

bootstrap()
