import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { rootStore }  from '../../stores';
import ConfirmPurchaseScreen from '../ConfirmPurchaseScreen';

const Wrapper = ({ children }) => <Provider store={rootStore}>{children}</Provider>;

const navigation = {
  navigate: jest.fn(),
};

const currentStoryMock = {
  name: 'Test Story',
  author: 'Test Author',
  picture: 'https://example.com/story-image.jpg',
};

rootStore.dispatch({
  type: 'storeSlice/setCurrentStory',
  payload: currentStoryMock,
});

describe('ConfirmPurchaseScreen', () => {
  it('renders ConfirmPurchaseScreen and its content correctly', () => {
    const { getByText } = render(<ConfirmPurchaseScreen navigation={navigation} />, { wrapper: Wrapper });
  
    expect(getByText("Awesome! You're ready to start!")).toBeTruthy();
    expect(getByText('Test Story')).toBeTruthy();
    expect(getByText('by Test Author')).toBeTruthy();
    expect(getByText(/You’ll be observing this exciting drama through Jessica’s phone. The story starts at 9:00 pm when Jessica gets a strange text from an unknown number./)).toBeTruthy();
    expect(getByText('Start the Story')).toBeTruthy();
  });
  
  it('navigates to the StoryHome screen when the "Start the Story" button is pressed', () => {
    const { getByText } = render(<ConfirmPurchaseScreen navigation={navigation} />, { wrapper: Wrapper });
    const startButton = getByText('Start the Story');
  
    fireEvent.press(startButton);
  
    expect(navigation.navigate).toHaveBeenCalledWith({ name: 'StoryHome' });
  });
})
