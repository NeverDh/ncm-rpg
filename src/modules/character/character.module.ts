import { Module } from '@nestjs/common';
import { InventoryModule } from '../inventory/inventory.module';
import { CharacterService } from './character.service';

@Module({
  imports: [InventoryModule],
  providers: [CharacterService],
  exports: [CharacterService],
})
export class CharacterModule {}
