import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import pkg from './pkg';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService)

  if(configService.get('isSwagger')) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(pkg.name || 'API')
      .setDescription(pkg.description || 'API Server')
      .setVersion(pkg.version || 'dev')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document);
   }

  const port = configService.get('port')

  await app.listen(port, () => {
    console.log(`Start at port ${port}`)
  });
}
bootstrap();
