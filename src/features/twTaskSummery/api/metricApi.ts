import { client } from '@/shared/api/client';
import { SummaryMetric } from '../types';

type JsonPlaceholderPost = { id: number; title: string };

export const getMetrics = async (): Promise<SummaryMetric[]> => {
  const metrics = await client.get<JsonPlaceholderPost[]>('/posts?_limit=5');
  return metrics.map(post => ({
    id: String(post.id),
    label: post.title,
    value: 44,
    // Random sign + magnitude (-50 to +50) so up/down states both actually
    // render once the card derives direction from this, not from value.
    deltaPercent: Math.round((Math.random() * 100 - 50) * 10) / 10,
    sparkline: [1, 4, 1, 2, 3, 2],
    // Random spread over the last ~14 days so Today/7d/10d actually
    // exclude different items instead of every item always being "now".
    time: new Date(Date.now() - Math.floor(Math.random() * 15) * 86_400_000),
  }));
};

