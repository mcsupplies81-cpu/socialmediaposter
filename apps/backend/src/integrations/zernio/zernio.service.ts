import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  ZernioConnectedAccount,
  ZernioPostResponse,
  ZernioPublishPostRequest,
} from '@gitroom/backend/integrations/zernio/zernio.types';

@Injectable()
export class ZernioService {
  private readonly logger = new Logger(ZernioService.name);
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.ZERNIO_API_URL || 'https://zernio.com/api/v1',
      headers: {
        Authorization: `Bearer ${process.env.ZERNIO_API_KEY || ''}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async publishPost(payload: ZernioPublishPostRequest): Promise<ZernioPostResponse> {
    return this.withRetry(() =>
      this.client.post<ZernioPostResponse>('/posts', payload).then((r) => r.data)
    );
  }

  async getConnectedAccounts(): Promise<ZernioConnectedAccount[]> {
    return this.withRetry(async () => {
      const { data } = await this.client.get<
        ZernioConnectedAccount[] | { accounts: ZernioConnectedAccount[] }
      >('/accounts');
      return Array.isArray(data) ? data : data.accounts;
    });
  }

  private async withRetry<T>(fn: () => Promise<T>, attempt = 1): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      const status = (err as AxiosError).response?.status;

      if (status === 401) {
        this.logger.error('[Zernio] Invalid API key — check ZERNIO_API_KEY in .env');
        throw new UnauthorizedException('Zernio authentication failed');
      }

      if (status === 429 && attempt <= 3) {
        const delay = Math.pow(2, attempt - 1) * 1000;
        this.logger.warn(`[Zernio] Rate limited — retrying in ${delay}ms (attempt ${attempt}/3)`);
        await new Promise((r) => setTimeout(r, delay));
        return this.withRetry(fn, attempt + 1);
      }

      if (status && status >= 500 && attempt === 1) {
        this.logger.warn(`[Zernio] Server error ${status} — retrying once`);
        await new Promise((r) => setTimeout(r, 2000));
        return this.withRetry(fn, attempt + 1);
      }

      if (status === 429) {
        throw new ServiceUnavailableException('Zernio rate limit exceeded after 3 retries');
      }

      throw err;
    }
  }
}
