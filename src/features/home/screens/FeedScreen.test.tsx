import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { FeedScreen } from './FeedScreen';

describe('FeedScreen', () => {
  it('renders title', () => {
    render(<FeedScreen />);
    expect(screen.getByText('Feed')).toBeTruthy();
  });
});
