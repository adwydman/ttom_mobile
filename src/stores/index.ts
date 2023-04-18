import {createSlice, configureStore} from '@reduxjs/toolkit';

export const initialState = {
  userToken: null,
  stories: [],
  currentStory: null,
  authors: {},
  textMessages: [],
  user: {},
  rawMessages: null,
  currentScreenName: null
};

export const storeSlice = createSlice({
  name: 'storeSlice',
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.userToken = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload
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
    setRawMessages: (state, action) => {
      state.rawMessages = action.payload;
    },
    setCurrentScreenName: (state, action) => {
      state.currentScreenName = action.payload;
    }
  },
});

export const {
  setUserToken,
  setUser,
  setCurrentStory,
  setAuthors,
  setStories,
  setTextMessages,
  setRawMessages,
  setCurrentScreenName,
} = storeSlice.actions;

export const rootStore = configureStore({
  reducer: {
    storeSlice: storeSlice.reducer,
  },
});
