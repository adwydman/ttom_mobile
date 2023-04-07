import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import fetch from 'jest-fetch-mock';
import * as SecureStore from 'expo-secure-store';
import { rootStore }  from '../../stores';
import CredentialsScreen from '../CredentialsScreen';

const navigation = { navigate: jest.fn() };

beforeEach(() => {
  fetch.resetMocks();
  jest.spyOn(SecureStore, 'setItemAsync');
});

const Wrapper = ({ children }) => <Provider store={rootStore}>{children}</Provider>;

describe('CredentialsScreen', () => {
  it('renders correctly in login mode', () => {
    const { getByPlaceholderText } = render(<CredentialsScreen mode="login" navigation={navigation} />, { wrapper: Wrapper });

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  it('renders correctly in register mode', () => {
    const { getByPlaceholderText } = render(<CredentialsScreen mode="register" navigation={navigation} />, { wrapper: Wrapper });

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  it('shows email error if email is empty', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<CredentialsScreen mode="register" navigation={navigation} />, { wrapper: Wrapper });
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Sign up');

    fireEvent.changeText(emailInput, '');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(queryByText('Email required.')).toBeTruthy();
    });
  });

  it('shows password error if password is empty', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<CredentialsScreen mode="register" navigation={navigation} />, { wrapper: Wrapper });
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Sign up');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, '');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(queryByText('Password cannot be empty.')).toBeTruthy();
    });
  });

  // Add more tests for different scenarios, e.g. successful login, successful registration, etc.
  it('submits login request and handles successful response', async () => {
    const expectedToken = 'token123';
    fetch.mockResponseOnce(JSON.stringify({ user: { token: expectedToken } }));
  
    const { getByPlaceholderText, getByText } = render(<CredentialsScreen mode="login" navigation={navigation} />, { wrapper: Wrapper });
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Log in');
  
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password');
    
    await act(async () => {
      fireEvent.press(submitButton);
      await waitFor(() => expect(SecureStore.setItemAsync).toHaveBeenCalled());
    });
  
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://10.0.0.74:3000/login', expect.objectContaining({ method: 'POST' }));
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('userToken', expectedToken);
  });
  
  it('submits registration request and handles successful response', async () => {
    const expectedToken = 'token123';
    fetch.mockResponseOnce(JSON.stringify({ user: { token: expectedToken } }));
  
    const { getByPlaceholderText, getByText } = render(<CredentialsScreen mode="register" navigation={navigation} />, { wrapper: Wrapper });
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Sign up');
  
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password');
    
    await act(async () => {
      fireEvent.press(submitButton);
      await waitFor(() => expect(SecureStore.setItemAsync).toHaveBeenCalled());
    });
  
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://10.0.0.74:3000/register', expect.objectContaining({ method: 'POST' }));
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('userToken', expectedToken);
  });

  it('shows login error alert when login fails', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 401 });
  
    const { getByPlaceholderText, getByText } = render(<CredentialsScreen mode="login" navigation={navigation} />, { wrapper: Wrapper });
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Log in');
  
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrong_password');
    
    const alertSpy = jest.spyOn(Alert, 'alert');
  
    await act(async () => {
      fireEvent.press(submitButton);
      await waitFor(() => expect(alertSpy).toHaveBeenCalled());
    });
  
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://10.0.0.74:3000/login', expect.objectContaining({ method: 'POST' }));
    expect(alertSpy).toHaveBeenCalled();
  });
  
  it('shows registration error alert when registration fails', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 409 });
  
    const { getByPlaceholderText, getByText } = render(<CredentialsScreen mode="register" navigation={navigation} />, { wrapper: Wrapper });
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Sign up');
  
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password');
  
    const alertSpy = jest.spyOn(Alert, 'alert');
  
    await act(async () => {
      fireEvent.press(submitButton);
      await waitFor(() => expect(alertSpy).toHaveBeenCalled());
    });
  
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://10.0.0.74:3000/register', expect.objectContaining({ method: 'POST' }));
    expect(alertSpy).toHaveBeenCalled();
  });
  
  it('navigates to the Login screen from the Register screen', () => {
    const { getByText } = render(<CredentialsScreen mode="register" navigation={navigation} />, { wrapper: Wrapper });
    const loginLink = getByText('Log in');
  
    fireEvent.press(loginLink);
  
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('navigates to the Register screen from the Login screen', () => {
    const { getByText } = render(<CredentialsScreen mode="login" navigation={navigation} />, { wrapper: Wrapper });
    const signUpLink = getByText('Sign up');
  
    fireEvent.press(signUpLink);
  
    expect(navigation.navigate).toHaveBeenCalledWith('Register');
  });
});
