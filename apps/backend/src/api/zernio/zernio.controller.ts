import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZernioService } from '@gitroom/backend/integrations/zernio/zernio.service';
import {
  ZernioPlatform,
  ZernioPostResponse,
} from '@gitroom/backend/integrations/zernio/zernio.types';

type ZernioTestPublishBody = {
  platform: Exclude<ZernioPlatform, 'x'>;
  accountId: string;
  content: string;
};

@ApiTags('Zernio')
@Controller('/api/zernio')
export class ZernioController {
  constructor(private readonly _zernioService: ZernioService) {}

  @Get('/accounts')
  async getAccounts() {
    return this._zernioService.getConnectedAccounts();
  }

  @Post('/test-publish')
  async testPublish(
    @Body() body: ZernioTestPublishBody
  ): Promise<ZernioPostResponse> {
    return this._zernioService.publishPost({
      platforms: [{ platform: body.platform, accountId: body.accountId }],
      content: body.content,
      publishNow: true,
    });
  }
}
