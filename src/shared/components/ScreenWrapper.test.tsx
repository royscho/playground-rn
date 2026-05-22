import React from 'react';
import { Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ScreenWrapper } from './ScreenWrapper';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>{children}</NavigationContainer>
);

describe('ScreenWrapper', () => {
  it('renders title in header', () => {
    render(<ScreenWrapper title="Test Title">{'content'}</ScreenWrapper>, {
      wrapper,
    });
    expect(screen.getByText('Test Title')).toBeTruthy();
  });

  it('renders subtitle when provided', () => {
    render(
      <ScreenWrapper title="T" subtitle="Sub">
        {'content'}
      </ScreenWrapper>,
      { wrapper },
    );
    expect(screen.getByText('Sub')).toBeTruthy();
  });

  it('renders children', () => {
    render(
      <ScreenWrapper title="T">
        <Text>hello world</Text>
      </ScreenWrapper>,
      { wrapper },
    );
    expect(screen.getByText('hello world')).toBeTruthy();
  });

  it('shows loading spinner when loading=true', () => {
    render(
      <ScreenWrapper title="T" loading>
        {'content'}
      </ScreenWrapper>,
      { wrapper },
    );
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('shows error message and retry when error provided', () => {
    const onRetry = jest.fn();
    render(
      <ScreenWrapper title="T" error={new Error('Something broke')} onRetry={onRetry}>
        {'content'}
      </ScreenWrapper>,
      { wrapper },
    );
    expect(screen.getByText('Something broke')).toBeTruthy();
    fireEvent.press(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('hides header when no title', () => {
    render(<ScreenWrapper>{'content'}</ScreenWrapper>, { wrapper });
    expect(screen.queryByRole('header')).toBeNull();
  });

  it('renders footer when provided', () => {
    render(
      <ScreenWrapper title="T" footer={<Text>footer content</Text>}>
        <Text>body</Text>
      </ScreenWrapper>,
      { wrapper },
    );
    expect(screen.getByText('footer content')).toBeTruthy();
  });
});
