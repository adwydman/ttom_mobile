import {
  buildUrl,
  sendRequest,
  isMainCharacter,
  generateConversationClusters,
  generateAvailableConversations,
  getMessageTimestamp,
  getShouldDisplayCenteredTimestamp,
  isImage,
} from '../index';

import { flatten } from 'lodash';
import moment from 'moment';

describe('Utility Functions', () => {
  const config = require('../../config.json');

  describe('buildUrl', () => {
    it('should return the complete URL', () => {
      const route = '/test-route';
      const expectedUrl = `${config.BACKEND_URL}${route}`;
      expect(buildUrl(route)).toEqual(expectedUrl);
    });
  });

  describe('isMainCharacter', () => {
    it('should return true for "me"', () => {
      expect(isMainCharacter('me')).toBeTruthy();
      expect(isMainCharacter('Me')).toBeTruthy();
    });

    it('should return false for other characters', () => {
      expect(isMainCharacter('Bob')).toBeFalsy();
    });
  });

  describe('generateConversationClusters', () => {
    it('should generate clusters of conversations', () => {
      const userStoryTextMessages = [
        { whoFrom: 'me', whoTo: 'Alice', message: 'Hi Alice' },
        { whoFrom: 'Alice', whoTo: 'me', message: 'Hi there!' },
        { whoFrom: 'me', whoTo: 'Bob', message: 'Hey Bob' },
        { whoFrom: 'Bob', whoTo: 'me', message: 'Hello!' },
      ];

      const expectedResult = {
        Alice: [
          [
            { whoFrom: 'me', whoTo: 'Alice', message: 'Hi Alice' },
            { whoFrom: 'Alice', whoTo: 'me', message: 'Hi there!' },
          ],
        ],
        Bob: [
          [
            { whoFrom: 'me', whoTo: 'Bob', message: 'Hey Bob' },
            { whoFrom: 'Bob', whoTo: 'me', message: 'Hello!' },
          ],
        ],
      };

      expect(generateConversationClusters(userStoryTextMessages)).toEqual(expectedResult);
    });
  });

  describe('generateAvailableConversations', () => {
    it('should generate available conversations and count unread messages', () => {
      const userStoryTextMessages = [
        { whoFrom: 'me', whoTo: 'Alice', message: 'Hi Alice', seenByUser: true },
        { whoFrom: 'Alice', whoTo: 'me', message: 'Hi there!', seenByUser: false },
        { whoFrom: 'me', whoTo: 'Bob', message: 'Hey Bob', seenByUser: true },
        { whoFrom: 'Bob', whoTo: 'me', message: 'Hello!', seenByUser: false },
      ];

      const expectedResult = [
        {
          Alice: [
            { whoFrom: 'me', whoTo: 'Alice', message: 'Hi Alice', seenByUser: true },
            { whoFrom: 'Alice', whoTo: 'me', message: 'Hi there!', seenByUser: false },
          ],
          Bob: [
            { whoFrom: 'me', whoTo: 'Bob', message: 'Hey Bob', seenByUser: true },
            { whoFrom: 'Bob', whoTo: 'me', message: 'Hello!', seenByUser: false },
          ],
        },
        2,
      ];

      expect(generateAvailableConversations(userStoryTextMessages)).toEqual(expectedResult);
    });
  });

  describe('getMessageTimestamp', () => {
    it('should return formatted timestamp', () => {
      const currentDate = new Date();
      const enabledAt = moment(currentDate).subtract(1, 'hours').toISOString();

      const offset = moment().utcOffset();
      const localEnabledAt = moment(enabledAt).add(offset, 'minutes');
      const formattedTime = localEnabledAt.format('h:mm a');
      
      expect(getMessageTimestamp(enabledAt)).toEqual(formattedTime);
    });

    it('should return formatted timestamp with "Yesterday"', () => {
      const yesterday = moment().subtract(1, 'days');
      const enabledAt = yesterday.toISOString();

      const offset = moment().utcOffset();
      const localEnabledAt = moment(enabledAt).add(offset, 'minutes');
      const formattedTime = localEnabledAt.format('h:mm a');

      expect(getMessageTimestamp(enabledAt)).toEqual(`Yesterday • ${formattedTime}`);
    });

    // Add more test cases for other conditions, e.g. more than 1 day difference
  });

  describe('getShouldDisplayCenteredTimestamp', () => {
    it('should display centered timestamp for first message', () => {
      const conversation = [
        { enabledAt: moment().subtract(1, 'hours').toISOString() },
        { enabledAt: moment().subtract(30, 'minutes').toISOString() },
      ];

      expect(getShouldDisplayCenteredTimestamp(0, conversation)).toBeTruthy();
    });

    it('should display centered timestamp for messages more than 30 minutes apart', () => {
      const conversation = [
        { enabledAt: moment().subtract(1, 'hours').toISOString() },
        { enabledAt: moment().subtract(31, 'minutes').toISOString() },
      ];

      expect(getShouldDisplayCenteredTimestamp(1, conversation)).toBeTruthy();
    });

    it('should not display centered timestamp for messages less than 30 minutes apart', () => {
      const conversation = [
        { enabledAt: moment().subtract(1, 'hours').toISOString() },
        { enabledAt: moment().subtract(29, 'minutes').toISOString() },
      ];

      expect(getShouldDisplayCenteredTimestamp(1, conversation)).toBeFalsy();
    });
  });

  describe('isImage', () => {
    it('should return true for image files', () => {
      expect(isImage('image.jpg')).toBeTruthy();
      expect(isImage('image.jpeg')).toBeTruthy();
      expect(isImage('image.png')).toBeTruthy();
      expect(isImage('image.gif')).toBeTruthy();
    });

    it('should return false for non-image files', () => {
      expect(isImage('image.txt')).toBeFalsy();
      expect(isImage('image.pdf')).toBeFalsy();
    });
  });
});
