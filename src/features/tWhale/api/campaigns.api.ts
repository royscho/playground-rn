import { client } from '@/shared/api/client';
import type { Campaign } from '../types';

type JsonPlaceholderPost = { id: number; title: string };

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const posts = await client.get<JsonPlaceholderPost[]>('/posts?_limit=5');
  return posts.map(post => ({
    campaignId: String(post.id),
    name: post.title,
  }));
};

export const createCampaign = async (name: string): Promise<Campaign> => {
  const post = await client.post<JsonPlaceholderPost>('/posts', {
    title: name,
  });
  return { campaignId: String(post.id), name: post.title };
};
