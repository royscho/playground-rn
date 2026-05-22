import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DashboardScreen } from './DashboardScreen';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>{children}</NavigationContainer>
);

describe('DashboardScreen', () => {
  it('renders title', () => {
    render(<DashboardScreen />, { wrapper });
    expect(screen.getByText('Dashboard')).toBeTruthy();
  });
});
