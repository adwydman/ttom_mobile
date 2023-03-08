import {createSlice, configureStore} from '@reduxjs/toolkit';

export const initialState = {
  userToken: null,
  stories: [],
  currentStory: {},
  authors: {},
  textMessages: [],
  textMessagesRefetchCounter: 0,
};

export const storeSlice = createSlice({
  name: 'storeSlice',
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.userToken = action.payload;
    },
    setCurrentStory: (state, action) => {
      state.currentStory = action.payload;
    },
    setAuthors: (state, action) => {
      state.authors = action.payload;
    },
    setStories: (state, action) => {
      state.stories = action.payload;
    },
    setTextMessages: (state, action) => {
      state.textMessages = action.payload;
    },
    setTextMessagesRefetchCounter: (state, action) => {
      state.textMessagesRefetchCounter = action.payload;
    },
  },
});

export const {
  setUserToken,
  setCurrentStory,
  setAuthors,
  setStories,
  setTextMessages,
  setTextMessagesRefetchCounter,
} = storeSlice.actions;

export const rootStore = configureStore({
  reducer: {
    storeSlice: storeSlice.reducer,
  },
});
