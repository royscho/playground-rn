import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PostDetailScreen } from './PostDetailScreen';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { id: '42' } }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>{children}</NavigationContainer>
);

describe('PostDetailScreen', () => {
  it('renders post id from route params', () => {
    render(<PostDetailScreen />, { wrapper });
    expect(screen.getByText('Post #42')).toBeTruthy();
  });
});
