import { useRef, useEffect } from 'react';
import { flatten } from 'lodash';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
const config = require('../../config.json');

export const buildUrl = (route: string): string => `${config.BACKEND_URL}${route}`;

export const sendRequest = async (route: string, options: any) => {
  const fetchResult = await fetch(buildUrl(route), options);
  const result = await fetchResult.json();

  return [result, fetchResult];
}

export const useInterval = (callback, delay) => {
  const intervalRef = useRef(null);
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === 'number') {
      intervalRef.current = window.setInterval(tick, delay);
      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);
  return intervalRef;
}

export const noAvailableStoriesMessage = [
  "Stories? All gone! But we're cooking up more! 🍳😋",
  "You've read them all? Story Master! More coming soon! 📚🏆",
  "Wow, you're a story-eating monster! Stay tuned for me! 📖👾",
  "No more tales? Hang tight, they're coming! 🚀📚",
  "Stories: 404 not found. Check later! 😉💻",
  "Oops! Stories went for a walk, back soon! 🚶‍♂️📚",
  "We're busy writing new tales. Patience, grasshopper! 🦗🖋️",
  "Story factory temporarily closed. Reopening soon! 🏭⏲️",
  "You've gobbled up all our stories! Nom nom nom! More soon! 🍽️📚",
  "Stories? Poof! Magic trick! Check back later. 🪄✨",
  "You've cleared the shelf! More stories brewing... ☕📖",
  "Stories out of stock. Restocking soon! 📦📚",
  "No more stories? Brace for the next wave! 🌊📚",
  "Paging Dr. Story! We need more tales, stat! 🚑📖",
]

export const isMainCharacter = (storyCharacter: string) => {
  return storyCharacter.toLowerCase() === 'me';
}

export const generateConversationClusters = (userStoryTextMessages) => {
  let previousContactName = null;
  return userStoryTextMessages.reduce((acc, message, index, array) => {
    const whoToSeparated = message.whoTo.split(';');

    let contactName = '';
 
    if (whoToSeparated.length === 1) {
      contactName = isMainCharacter(message.whoFrom) ? message.whoTo : message.whoFrom;
    } else {
      contactName = whoToSeparated.join(', ');
    }


    if (!acc[contactName]) {
      acc[contactName] = [];
    }

    const conversation = acc[contactName];

    let cluster;
    if (previousContactName !== contactName) {
      cluster = [];
      conversation.push(cluster);

      if (!previousContactName) { // first cluster should always be visible
        cluster.__canBeDisplayed__ = true;
      } else {
        const previousMessage = array[index - 1];

        cluster.__canBeDisplayed__ = previousMessage.seenByUser;
      }
    } else {
      cluster = conversation[conversation.length - 1];
    }

    // const now = new Date();
    // if (new Date(message.enabledAt) <= now) {
    //   cluster.push(message);
    // }

    cluster.push(message);

    previousContactName = contactName

    return acc;
  }, {})
};

export const generateAvailableConversations = (userStoryTextMessages) => {
  const conversationClusters = generateConversationClusters(userStoryTextMessages);

  let totalAvailableMessages = 0;
  const parsedConversations = {};
  let visibleMessages = []
  Object.keys(conversationClusters).forEach((contactName) => {
    const clusters = conversationClusters[contactName];

    const availableClusters = clusters.filter((c) => c.__canBeDisplayed__);
    const availableMessages = flatten(availableClusters);
    visibleMessages = [
      ...visibleMessages,
      availableMessages,
    ]

    if (availableMessages.length > 0) {
      const unreadMessagesCount = availableMessages.filter((m) => !m.seenByUser).length;

      totalAvailableMessages += unreadMessagesCount;
      parsedConversations[contactName] = availableMessages;
    }
  })

  visibleMessages = flatten(visibleMessages);

  return [parsedConversations, totalAvailableMessages, visibleMessages];
}

export const saveMessages = async (messageKey, messagesData) => {
  const timestamp = new Date().getTime();
  const keyWithTimestamp = `messages_${messageKey}_${timestamp}`;
  try {
    await AsyncStorage.setItem(keyWithTimestamp, JSON.stringify(messagesData));
  } catch (error) {
    console.error('Error saving message:', error);
  }
}

const offset = moment().utcOffset();

export const getMessageTimestamp = (enabledAt) => {
  const messageEnabledAtLocal = moment(enabledAt).add(offset, 'minutes');  // moment(enabledAt) is UTC time
  // const currentDate = moment(new Date()).startOf('day').add(offset, 'minutes');  // Central Time
  const currentDate = moment(new Date());  // Central Time

  const diffInDays = currentDate.diff(messageEnabledAtLocal, 'days');

  let displayedDate = null;
  if (diffInDays === 1) {
    displayedDate = 'Yesterday';
  } else if (diffInDays > 1) {
    const dayName = messageEnabledAtLocal.format('dddd')

    if (diffInDays < 6) {
      displayedDate = dayName;
    } else if (diffInDays >= 6 && diffInDays <= 365) {
      displayedDate = `${dayName}, ${messageEnabledAtLocal.format('MMM')} ${messageEnabledAtLocal.format('D')}`;
    } else if (diffInDays > 365) {
      displayedDate = `${dayName}, ${messageEnabledAtLocal.format('MMM')} ${messageEnabledAtLocal.format('D')} ${messageEnabledAtLocal.format('YYYY')}`;
    }
  } 

  return `${displayedDate ? `${displayedDate} • ` : ''}${moment(enabledAt).format('h:mm a')}`;
}

export const getShouldDisplayCenteredTimestamp = (i, conversation) => {
  let shouldDisplayCenteredTimestamp = false;

  if (i === 0) {
    shouldDisplayCenteredTimestamp = true;
  } else {
    const messageEnabledAtLocal = moment(conversation[i].enabledAt);  // moment(enabledAt) is UTC time
    const previousMessageEnabledAt = moment(conversation[i-1].enabledAt);

    const messageMinutesApart = messageEnabledAtLocal.diff(previousMessageEnabledAt, 'minutes');

    if (messageMinutesApart >= 30) {
      shouldDisplayCenteredTimestamp = true;
    }
  }

  return shouldDisplayCenteredTimestamp;
}

export const isImage = (message: string) => /\.(jpg|jpeg|png|gif)$/.test(message);

export const isDateWithinLastMinute = (dateString: string) => {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Get the current date and time
  const now = new Date();

  // Calculate the difference between the current date and time and the given date
  const differenceInMilliseconds = now.getTime() - date.getTime();

  // Check if the difference is less than or equal to 60,000 milliseconds (1 minute)
  return differenceInMilliseconds >= 0 && differenceInMilliseconds <= 60000;
}

const getAccessKey = (userId) => `user_story_access_${userId}`;

export const saveAccessTimestamp = async (userId, storyId) => {
  const accessKey = getAccessKey(userId);
  const timestamp = new Date().toISOString();
  try {
    const timestampsJSON = await AsyncStorage.getItem(accessKey);
    const timestamps = timestampsJSON ? JSON.parse(timestampsJSON) : {};
    timestamps[storyId] = timestamp;
    await AsyncStorage.setItem(accessKey, JSON.stringify(timestamps));
  } catch (error) {
    console.error('Error saving access timestamp:', error);
  }
};

export const getAccessTimestamps = async (userId) => {
  const accessKey = getAccessKey(userId);
  try {
    const timestampsJSON = await AsyncStorage.getItem(accessKey);
    const timestamps = timestampsJSON ? JSON.parse(timestampsJSON) : {};
    return timestamps;
  } catch (error) {
    console.error('Error retrieving access timestamps:', error);
  }
};

export const sortStoriesByAccess = async (userId, stories) => {
  const timestamps = await getAccessTimestamps(userId);

  const storiesWithTimestamps = stories.map((story) => {
    const timestamp = timestamps[story._id] || null;
    return {
      ...story,
      accessTimestamp: timestamp,
    };
  });

  storiesWithTimestamps.sort((a, b) => {
    return new Date(b.accessTimestamp) - new Date(a.accessTimestamp);
  });

  return storiesWithTimestamps;
};

export const convertTo12Hour = (time24: string) => {
  const [hours, minutes] = time24.split(':');
  const hours12 = (hours % 12) || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hours12}:${minutes} ${ampm}`;
}
