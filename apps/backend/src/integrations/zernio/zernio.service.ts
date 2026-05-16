import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import {
  ZernioConnectedAccount,
  ZernioPostResponse,
  ZernioPublishPostRequest,
} from '@gitroom/backend/integrations/zernio/zernio.types';

@Injectable()
export class ZernioService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.ZERNIO_API_URL || 'https://api.zernio.com',
      headers: {
        Authorization: `Bearer ${process.env.ZERNIO_API_KEY || ''}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async publishPost(
    payload: ZernioPublishPostRequest
  ): Promise<ZernioPostResponse> {
    const { data } = await this.client.post<ZernioPostResponse>(
      '/posts/publish',
      payload
    );

    return data;
  }

  async getConnectedAccounts(): Promise<ZernioConnectedAccount[]> {
    const { data } = await this.client.get<
      ZernioConnectedAccount[] | { accounts: ZernioConnectedAccount[] }
    >('/accounts');

    return Array.isArray(data) ? data : data.accounts;
  }
}
