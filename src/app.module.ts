import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { BotModule } from './bot/bot.module';
import { HealthController } from './health.controller';
import { PrismaModule } from './infra/prisma/prisma.module';
import { CharacterModule } from './modules/character/character.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      load: [configuration],
    }),
    PrismaModule,
    CharacterModule,
    BotModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
