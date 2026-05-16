export type ZernioPlatform =
  | 'twitter'
  | 'x'
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'reddit';

export type ZernioMediaItem = {
  type: 'image' | 'video';
  url: string;
};

export type ZernioPublishPostRequest = {
  platforms: ZernioPlatform[];
  accountId?: string;
  content: string;
  mediaItems?: ZernioMediaItem[];
  publishNow: boolean;
};

export type ZernioPostResponse = {
  id?: string;
  postId?: string;
  status?: string;
  releaseURL?: string;
  [key: string]: unknown;
};

export type ZernioConnectedAccount = {
  id: string;
  platform: ZernioPlatform;
  name?: string;
  username?: string;
  [key: string]: unknown;
};
