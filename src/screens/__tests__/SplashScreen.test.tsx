import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SplashScreen from '../SplashScreen';

describe('SplashScreen', () => {
  const navigation = {
    navigate: jest.fn(),
  };

  it('renders SplashScreen correctly', () => {
    const { getByText } = render(<SplashScreen navigation={navigation} />);
    expect(getByText('a chat fiction app for grown-ups')).toBeTruthy();
  });

  it('navigates to Login screen when "Log in" button is pressed', () => {
    const { getByText } = render(<SplashScreen navigation={navigation} />);
    const loginButton = getByText('Log in');
    fireEvent.press(loginButton);
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('navigates to Register screen when "Sign up" button is pressed', () => {
    const { getByText } = render(<SplashScreen navigation={navigation} />);
    const signUpButton = getByText('Sign up');
    fireEvent.press(signUpButton);
    expect(navigation.navigate).toHaveBeenCalledWith('Register');
  });
});
