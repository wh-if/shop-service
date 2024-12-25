import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './config';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/role.guard';
import { AllExceptionsFilter } from './filter/exception.filter';
import {
  AppController,
  SystemController,
  UploadController,
  UserController,
  AuthController,
  CategoryController,
  ProductController,
  CollectController,
  SetsController,
  CouponController,
  CommentsController,
  OrderController,
} from './controller';
import {
  AppService,
  SystemService,
  UserService,
  AuthService,
  CategoryService,
  ProductService,
  CollectService,
  SetsService,
  CouponService,
  CommentsService,
  OrderService,
} from './service';

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
    SetsController,
    CouponController,
    CommentsController,
    OrderController,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard }, // token校验
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
    SystemService,
    UserService,
    AuthService,
    CategoryService,
    ProductService,
    CollectService,
    SetsService,
    CouponService,
    CommentsService,
    OrderService,
  ],
})
export class AppModule {}
