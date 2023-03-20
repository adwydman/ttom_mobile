import { colors } from '../colors';

export const style = {
  imageCover: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
    paddingBottom: 16
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
    elevation: 1,
    transform: [ { rotate: '180deg'} ],
  },
  titleWrapper: {
    position: 'absolute', 
    zIndex: 2, 
    elevation: 2, 
    bottom: 16 
  },
  storyTitle: {
    color: colors.white,
  },
  storyAuthor: {
    color: colors.white,
  },
}
