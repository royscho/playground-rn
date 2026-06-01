import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FeedScreen } from './FeedScreen';

const mockPosts = [
  { id: 1, userId: 1, title: 'first post title', body: 'body text' },
  { id: 2, userId: 1, title: 'second post title', body: 'body text' },
];

jest.mock('../hooks/useFeedPosts', () => ({
  useFeedPosts: jest.fn(),
}));

const { useFeedPosts } = require('../hooks/useFeedPosts');

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={client}>
      <NavigationContainer>{children}</NavigationContainer>
    </QueryClientProvider>
  );
};

describe('FeedScreen', () => {
  it('renders title', () => {
    useFeedPosts.mockReturnValue({
      data: { pages: [mockPosts] },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
    render(<FeedScreen />, { wrapper });
    expect(screen.getByText('Feed')).toBeTruthy();
  });

  it('shows loading state', () => {
    useFeedPosts.mockReturnValue({
      data: undefined,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    });
    render(<FeedScreen />, { wrapper });
    expect(screen.queryByText('first post title')).toBeNull();
  });

  it('renders posts', async () => {
    useFeedPosts.mockReturnValue({
      data: { pages: [mockPosts] },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
    render(<FeedScreen />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText('first post title')).toBeTruthy();
    });
  });

  it('shows end of feed when no next page', async () => {
    useFeedPosts.mockReturnValue({
      data: { pages: [mockPosts] },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
    render(<FeedScreen />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText('All caught up')).toBeTruthy();
    });
  });
});
