import { Module } from '@nestjs/common';
import { ZernioService } from '@gitroom/backend/integrations/zernio/zernio.service';

@Module({
  providers: [ZernioService],
  exports: [ZernioService],
})
export class ZernioModule {}
