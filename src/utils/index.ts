import { useRef, useEffect } from 'react';
import { flatten } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
const config = require('../../config.json');

export const buildUrl = (route: string): string => `${config.BACKEND_URL}${route}`;

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

const generateConversationClusters = (userStoryTextMessages) => {
  let previousContactName = null;
  return userStoryTextMessages.reduce((acc, message, index, array) => {
    const contactName = isMainCharacter(message.whoFrom) ? message.whoTo : message.whoFrom;

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

    cluster.push(message);

    previousContactName = contactName

    return acc;
  }, {})
};

export const generateAvailableConversations = (userStoryTextMessages) => {
  const conversationClusters = generateConversationClusters(userStoryTextMessages);

  let totalAvailableMessages = 0;
  const parsedConversations = {};
  Object.keys(conversationClusters).forEach((contactName) => {
    const clusters = conversationClusters[contactName];

    const availableClusters = clusters.filter((c) => c.__canBeDisplayed__);
    const availableMessages = flatten(availableClusters);

    if (availableMessages.length > 0) {
      const unreadMessagesCount = availableMessages.filter((m) => !m.seenByUser).length;

      totalAvailableMessages += unreadMessagesCount;
      parsedConversations[contactName] = availableMessages;
    }
  })

  return [parsedConversations, totalAvailableMessages];
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
