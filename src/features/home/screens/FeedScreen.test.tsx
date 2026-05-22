import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { FeedScreen } from './FeedScreen';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>{children}</NavigationContainer>
);

describe('FeedScreen', () => {
  it('renders title', () => {
    render(<FeedScreen />, { wrapper });
    expect(screen.getByText('Feed')).toBeTruthy();
  });
});
