export type ZernioPlatform =
  | 'twitter'
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'reddit'
  | 'linkedin'
  | 'youtube'
  | 'bluesky'
  | 'threads';

export type ZernioMediaItem = {
  type: 'image' | 'video' | 'document';
  url: string;
};

export type ZernioPlatformTarget = {
  platform: ZernioPlatform;
  accountId: string;
};

export type ZernioPublishPostRequest = {
  platforms: ZernioPlatformTarget[];
  content: string;
  mediaItems?: ZernioMediaItem[];
  publishNow?: boolean;
  scheduledFor?: string;
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
  displayName?: string;
  username?: string;
  [key: string]: unknown;
};
