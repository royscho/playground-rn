import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { DashboardScreen } from './DashboardScreen';

describe('DashboardScreen', () => {
  it('renders title', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('Dashboard')).toBeTruthy();
  });
});
