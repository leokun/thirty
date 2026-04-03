import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FavoriteModule } from './favorite/favorite.module';
import { FoodModule } from './food/food.module';
import { JournalModule } from './journal/journal.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [FoodModule, JournalModule, ScoreModule, FavoriteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
