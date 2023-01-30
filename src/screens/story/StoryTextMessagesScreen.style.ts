import { colors } from '../../colors';

export const style = {
  messageWrapper: {
    position: 'relative',
    flexDirection: 'row',
    height: 80,
    borderBottomColor: colors.grey,
    borderBottomWidth: 1
  },
  newMessageIcon: {
    marginTop: 34,
    left: 8,
    position: 'absolute'
  },
  contactIcon: {
    position: 'absolute',
    marginTop: 24,
    left: 40
  },
  messagePreviewContainer: {
    flex: 1,
    marginTop: 8,
    marginLeft: 80
  },
  messagePreviewWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  contactName: {
    marginBottom: 2,
    fontSize: 20
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timestamp: {
    marginRight: 8,
    color: colors.grey2 
  },
  chevron: {
    marginRight: 4
  },
  trimmedMessage: {
    marginRight: 8,
    fontSize: 16
  }
}
