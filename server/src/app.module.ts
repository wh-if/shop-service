import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemService } from './service/system.service';
import { SystemController } from './controller/system.controller';
import AppConfig from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      ...AppConfig.mysql,
      entities: [__dirname + '/entity/**.entity.js'],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController, SystemController],
  providers: [AppService, SystemService],
})
export class AppModule {}
