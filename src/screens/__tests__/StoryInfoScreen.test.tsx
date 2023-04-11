import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import StoryInfoScreen from '../StoryInfoScreen';
import { Provider } from 'react-redux';
import { rootStore, setUser, setCurrentStory } from '../../stores';

const initialState = {
  userToken: 'userToken',
  stories: [],
  currentStory: {
    _id: 'storyId',
    name: 'Test Story',
    author: 'Test Author',
    picture: 'https://example.com/test-image.jpg',
    description: 'Test description',
  },
  authors: {},
  textMessages: [],
  user: {
    stories: [],
  },
  rawMessages: null,
};

rootStore.dispatch(setUser(initialState.user));
rootStore.dispatch(setCurrentStory(initialState.currentStory));

const navigation = {
  navigate: jest.fn(),
  setOptions: jest.fn(),
};

const route = {};

describe('StoryInfoScreen', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ user: {} }),
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders StoryInfoScreen correctly', () => {
    const { getByText } = render(
      <Provider store={rootStore}>
        <StoryInfoScreen navigation={navigation} route={route} />
      </Provider>,
    );

    expect(getByText('Test Story')).toBeTruthy();
  });

  it('toggles "Add to Library (Free)" confirmation', () => {
    const { getByText, queryByText } = render(
      <Provider store={rootStore}>
        <StoryInfoScreen navigation={navigation} route={route} />
      </Provider>,
    );

    const addToLibraryButton = getByText('Add to Library (Free)');
    fireEvent.press(addToLibraryButton);
    expect(getByText('Add Test Story to your library for $0.00?')).toBeTruthy();
    expect(queryByText('Add to Library (Free)')).toBeNull();

    const nopeButton = getByText('Nope');
    fireEvent.press(nopeButton);
    expect(queryByText('Add Test Story to your library for $0.00?')).toBeNull();
    expect(getByText('Add to Library (Free)')).toBeTruthy();
  });

  it('adds a story to library and navigates to ConfirmPurchase', async () => {
    const { getByText } = render(
      <Provider store={rootStore}>
        <StoryInfoScreen navigation={navigation} route={route} />
      </Provider>,
    );

    const addToLibraryButton = getByText('Add to Library (Free)');
    fireEvent.press(addToLibraryButton);
    const yesAddItButton = getByText('Yes! Add it!');
    fireEvent.press(yesAddItButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(navigation.navigate).toHaveBeenCalledWith({
        name: 'ConfirmPurchase',
      });
    });
  });
});
