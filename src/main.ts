import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 资源文件映射
  app.useStaticAssets(join(__dirname, '..', 'upload'), {
    prefix: '/static/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
