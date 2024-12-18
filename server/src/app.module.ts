import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemService } from './service/system.service';
import { SystemController } from './controller/system.controller';
import { AppConfig } from './config';
import { UploadController } from './controller/upload.controller';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { CategoryService } from './service/category.service';
import { CategoryController } from './controller/category.controller';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { CollectController } from './controller/collect.controller';
import { CollectService } from './service/collect.service';

@Module({
  imports: [
    /**
     * 数据库实体关系映射
     */
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      ...AppConfig.mysql,
      entities: [__dirname + '/entity/**.entity.js'],
      synchronize: true,
      autoLoadEntities: true,
      logging: ['query'],
    }),
    /**
     * token认证
     */
    JwtModule.register({
      global: true,
      secret: AppConfig.auth.jwt_secret,
    }),
  ],
  controllers: [
    AppController,
    SystemController,
    UploadController,
    UserController,
    AuthController,
    CategoryController,
    ProductController,
    CollectController,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard }, // token校验
    AppService,
    SystemService,
    UserService,
    AuthService,
    CategoryService,
    ProductService,
    CollectService,
  ],
})
export class AppModule {}
