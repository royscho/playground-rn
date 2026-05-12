import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { PostDetailScreen } from './PostDetailScreen';

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { id: '42' } }),
}));

describe('PostDetailScreen', () => {
  it('renders post id from route params', () => {
    render(<PostDetailScreen />);
    expect(screen.getByText('Post #42')).toBeTruthy();
  });
});
