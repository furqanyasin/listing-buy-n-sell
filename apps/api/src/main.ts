import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)

  // ── Global prefix ──────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1')

  // ── CORS ───────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // ── Global Validation Pipe ─────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip unknown properties
      forbidNonWhitelisted: true, // Throw on unknown properties
      transform: true,            // Auto-transform to DTO types
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // ── Swagger / OpenAPI Docs ─────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('CNC Machine Bazaar API')
      .setDescription('CNC Machine Bazaar REST API — v1')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Users', 'User management')
      .addTag('Listings', 'Machine listings')
      .addTag('Search', 'Search & filtering')
      .addTag('Dealers', 'Supplier profiles')
      .addTag('Media', 'File uploads')
      .addTag('Blog', 'Blog & articles')
      .addTag('Admin', 'Admin panel')
      .build()

    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })

    logger.log('Swagger docs available at: http://localhost:4000/api/docs')
  }

  const port = process.env.APP_PORT || 4000
  await app.listen(port)

  logger.log(`🚀 API running on: http://localhost:${port}/api/v1`)
}

bootstrap()
