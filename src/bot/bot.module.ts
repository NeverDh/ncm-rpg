import { Module } from '@nestjs/common';
import { CharacterModule } from '../modules/character/character.module';
import { InventoryModule } from '../modules/inventory/inventory.module';
import { BotService } from './bot.service';

@Module({
  imports: [CharacterModule, InventoryModule],
  providers: [BotService],
})
export class BotModule {}
