import { Module } from '@nestjs/common';
import { CharacterModule } from '../modules/character/character.module';
import { BotService } from './bot.service';

@Module({
  imports: [CharacterModule],
  providers: [BotService],
})
export class BotModule {}
