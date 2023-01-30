import { colors } from '../../colors';

export const style = {
  bubble: {
    borderRadius: 6,
    padding: 8,
    maxWidth: '70%',
    marginBottom: 2
  },
  left: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    marginLeft: 16
  },
  right: {
    alignSelf: 'flex-end',
    backgroundColor: colors.blue,
    marginRight: 16
  },
  timestamp: {
    color: '#bcc1c6',
    fontSize: 10,
  },
  message: {
    fontSize: 16,
    lineHeight: 24
  },
  leftFont: {},
  rightFont: {
    color: colors.white
  },
  tail: {
    position: 'absolute',
    bottom: 4,
  },
  leftTail: {
    left: 8,
  },
  rightTail: {
    right: 8,
    transform: [ { scaleX: -1 } ]
  }
}
