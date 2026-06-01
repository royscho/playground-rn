import { useInfiniteQuery } from '@tanstack/react-query';

const PAGE_LIMIT = 10;

export interface FeedPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

const fetchPosts = async ({ pageParam }: { pageParam: number }): Promise<FeedPost[]> => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${PAGE_LIMIT}`,
  );
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
};

export const useFeedPosts = () =>
  useInfiniteQuery({
    queryKey: ['feed', 'posts'],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_LIMIT ? allPages.length + 1 : undefined,
  });
