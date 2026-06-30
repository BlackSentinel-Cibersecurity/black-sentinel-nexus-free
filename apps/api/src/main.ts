import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));
  app.use(compression());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Health endpoint (outside global prefix)
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/api/v1/health', (_req: any, res: any) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(), 
      version: '1.0.0-free',
      edition: 'free',
      limits: {
        maxUsers: 3,
        maxConnectors: 10,
        maxCorrelationRules: 2,
        languages: ['en', 'es'],
      }
    });
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('BlackSentinel Nexus API [FREE Edition]')
    .setDescription('Next-Generation Security Operations Platform API - Free Edition with limited features')
    .setVersion('1.0-free')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('events', 'Security event management')
    .addTag('incidents', 'Incident management')
    .addTag('assets', 'Asset management')
    .addTag('users', 'User management (max 3 users)')
    .addTag('threats', 'Threat intelligence')
    .addTag('connectors', 'Connector management (10 templates)')
    .addTag('playbooks', 'SOAR playbook management')
    .addTag('ai', 'AI Copilot endpoints')
    .addTag('digital-twin', 'Digital Twin visualization')
    .addTag('reports', 'Report generation (no PDF export)')
    .addTag('settings', 'User settings')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get('PORT', 3001);
  await app.listen(port);

  logger.log(`BlackSentinel Nexus API [FREE Edition] running on http://localhost:${port}`);
  logger.log(`API docs at http://localhost:${port}/docs`);
  logger.log(`Environment: ${configService.get('NODE_ENV', 'development')}`);
  logger.log(`Limits: 3 users, 10 connectors, 2 correlation rules, EN/ES only`);
}

bootstrap();
