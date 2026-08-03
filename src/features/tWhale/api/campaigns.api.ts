import { client } from '@/shared/api/client';
import type { Campaign } from '../types';

type JsonPlaceholderPost = { id: number; title: string };

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const posts = await client.get<JsonPlaceholderPost[]>('/posts?_limit=5');
  return posts.map(post => ({
    campaignId: String(post.id),
    name: post.title,
    status: post.id > 3 ? 'active' : 'pause',
    isFavorite: false,
  }));
};

export const createCampaign = async (name: string): Promise<Campaign> => {
  const post = await client.post<JsonPlaceholderPost>('/posts', {
    title: name,
  });
  return {
    campaignId: String(post.id),
    name: post.title,
    status: 'active',
    isFavorite: false,
  };
};

// JSONPlaceholder doesn't persist writes (same caveat as createCampaign) —
// this is a fire-and-confirm PATCH, the optimistic cache flip in the
// mutation's onMutate is what actually drives the UI.
export const updateCampaignFavorite = (
  campaignId: string,
  isFavorite: boolean,
): Promise<JsonPlaceholderPost> =>
  client.patch<JsonPlaceholderPost>(`/posts/${campaignId}`, { isFavorite });
