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
  const config = require('../../../config.json');

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
  })

  describe('generateConversationClusters', () => {
    let originalDateNow;

    beforeAll(() => {
      // Freeze time to April 13, 2023 at 12:00:00 UTC
      originalDateNow = Date.now;
      Date.now = () => new Date('2023-04-13T12:00:00.000Z').getTime();
    });
  
    afterAll(() => {
      Date.now = originalDateNow;
    });

    it('should group text messages by contact name', () => {
      const userStoryTextMessages = [
        { whoFrom: 'Alice', whoTo: 'Bob', enabledAt: '2023-04-13T12:00:00.000Z', seenByUser: true },
        { whoFrom: 'Bob', whoTo: 'Alice', enabledAt: '2023-04-13T12:05:00.000Z', seenByUser: true },
        { whoFrom: 'Charlie', whoTo: 'Alice', enabledAt: '2023-04-13T12:10:00.000Z', seenByUser: true },
        { whoFrom: 'Alice', whoTo: 'Charlie', enabledAt: '2023-04-13T12:15:00.000Z', seenByUser: true }
      ];
    
      const expectedClusters = Object.assign(Object.create(null), {
        'Alice': [
          [
            { whoFrom: 'Alice', whoTo: 'Bob', enabledAt: '2023-04-13T12:00:00.000Z', seenByUser: true },
          ],
          [
            { whoFrom: 'Alice', whoTo: 'Charlie', enabledAt: '2023-04-13T12:15:00.000Z', seenByUser: true },
          ]
        ],
        'Bob': [
          [
            { whoFrom: 'Bob', whoTo: 'Alice', enabledAt: '2023-04-13T12:05:00.000Z', seenByUser: true },
          ]
        ],
        'Charlie': [
          [
            { whoFrom: 'Charlie', whoTo: 'Alice', enabledAt: '2023-04-13T12:10:00.000Z', seenByUser: true },
          ]
        ]
      });
    
      const actualClusters = generateConversationClusters(userStoryTextMessages);
    
      expect(JSON.stringify(actualClusters).trim()).toEqual(JSON.stringify(expectedClusters).trim());
    });

    it('should handle empty input array', () => {
      const userStoryTextMessages = [];
      const expectedClusters = {};
    
      const actualClusters = generateConversationClusters(userStoryTextMessages);
    
      expect(actualClusters).toEqual(expectedClusters);
    });

    it('should handle messages with future dates', () => {
      const now = new Date('2023-04-13T12:00:00.000Z');
    
      const userStoryTextMessages = [
        { whoFrom: 'Alice', whoTo: 'Bob', enabledAt: '2023-04-13T12:00:00.000Z', seenByUser: true },
        { whoFrom: 'Bob', whoTo: 'Alice', enabledAt: '2023-04-13T12:05:00.000Z', seenByUser: true },
        { whoFrom: 'Charlie', whoTo: 'Alice', enabledAt: '2023-04-14T12:15:00.000Z', seenByUser: true },
        { whoFrom: 'Alice', whoTo: 'Charlie', enabledAt: '2023-04-13T12:15:00.000Z', seenByUser: true }
      ];
    
      const expectedClusters = {
        'Alice': [
          [
            { whoFrom: 'Alice', whoTo: 'Bob', enabledAt: '2023-04-13T12:00:00.000Z', seenByUser: true },
          ],
          [
            { whoFrom: 'Alice', whoTo: 'Charlie', enabledAt: '2023-04-13T12:15:00.000Z', seenByUser: true },
          ]
        ],
        'Bob': [
          [
            { whoFrom: 'Bob', whoTo: 'Alice', enabledAt: '2023-04-13T12:05:00.000Z', seenByUser: true },
          ]
        ],
        'Charlie': [
          [
            { whoFrom: 'Charlie', whoTo: 'Alice', enabledAt: '2023-04-14T12:15:00.000Z', seenByUser: true },
          ]
        ]
      };
    
      jest.spyOn(global, 'Date').mockImplementation(() => now);
    
      const actualClusters = generateConversationClusters(userStoryTextMessages);
    
      global.Date.mockRestore();
    
      expect(JSON.stringify(actualClusters)).toEqual(JSON.stringify(expectedClusters));
    });

    it('should group messages by the recipient when the sender is not the main character', () => {
      const userStoryTextMessages = [
        { whoFrom: 'Charlie', whoTo: 'Alice', enabledAt: new Date('2023-04-13T12:00:00.000Z'), seenByUser: true },
        { whoFrom: 'Bob', whoTo: 'Alice', enabledAt: new Date('2023-04-13T12:05:00.000Z'), seenByUser: true },
        { whoFrom: 'Charlie', whoTo: 'Alice', enabledAt: new Date('2023-04-13T12:10:00.000Z'), seenByUser: true },
        { whoFrom: 'Charlie', whoTo: 'Alice', enabledAt: new Date('2023-04-13T12:15:00.000Z'), seenByUser: true },
      ];
    
      const expectedClusters = {
        "Charlie": [
          [
            { "whoFrom": "Charlie", "whoTo": "Alice", "enabledAt": "2023-04-13T12:00:00.000Z", "seenByUser": true },
          ],
          [
            { "whoFrom": "Charlie", "whoTo": "Alice", "enabledAt": "2023-04-13T12:10:00.000Z", "seenByUser": true },
            { "whoFrom": "Charlie", "whoTo": "Alice", "enabledAt": "2023-04-13T12:15:00.000Z", "seenByUser": true }
          ]
        ],
        "Bob": [
          [
            { "whoFrom": "Bob", "whoTo": "Alice", "enabledAt": "2023-04-13T12:05:00.000Z", "seenByUser": true }
          ]
        ]
      };
    
      const actualClusters = generateConversationClusters(userStoryTextMessages);
    
      expect(JSON.stringify(actualClusters)).toEqual(JSON.stringify(expectedClusters));
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
