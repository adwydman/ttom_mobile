export const style = {
  imageCover: {
    justifyContent: 'flex-end'
  },
  storyTitle: {
    fontSize: 24,
    marginBottom: 6,
    fontFamily: 'Niveau_smallCaps',
    color: 'white', // temp
    zIndex: 2,
  },
  storyAuthor: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'Niveau_smallCaps',
    color: 'white', // temp
    zIndex: 2,
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
}
