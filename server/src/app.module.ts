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
import { SetsService } from './service/sets.service';
import { SetsController } from './controller/sets.controller';
import { CouponService } from './service/coupon.service';
import { CouponController } from './controller/coupon.controller';
import { CommentsService } from './service/comments.service';
import { CommentsController } from './controller/comments.controller';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { RolesGuard } from './guard/role.guard';

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
