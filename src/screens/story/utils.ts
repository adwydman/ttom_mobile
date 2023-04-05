import { flatten } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const generateConversationClusters = (userStoryTextMessages, story) => {
  let previousContactName = null;
  return userStoryTextMessages.reduce((acc, message, index, array) => {
    const contactName = message.whoFrom === story.mainCharacter ? message.whoTo : message.whoFrom;

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

export const generateAvailableConversations = (userStoryTextMessages, story) => {
  const conversationClusters = generateConversationClusters(userStoryTextMessages, story);

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
