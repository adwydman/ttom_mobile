import { colors } from '../colors';

export const style = {
  ownerStoryContainer: {
    backgroundColor: colors.white,
    marginBottom: 8,
    shadowOffset: {width: -2, height: 4},  
    shadowColor: colors.black,  
    shadowOpacity: 0.2,  
    shadowRadius: 3,  
  },
  imageCover: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 16
  },
  progressContainer: {
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 6,
    marginRight: 6
  },
  unreadMessagesContainer: {
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  unreadMessagesBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 16,
    width: 16,
    backgroundColor: colors.pinkyOrange, 
    borderRadius: 100
  },
  unreadMessagesFont: {
    fontSize: 11,
    fontFamily: 'NiveauGroteskLight'
  },
  percentageProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  percentageFont: {
    fontSize: 12,
    marginRight: 4
  },
  percentageBarContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: 8,
    backgroundColor: colors.offWhite1,
    borderRadius: 100
  },
  percentageBar: {
    position: 'absolute',
    backgroundColor: colors.blue,
    height: 8,
    borderRadius: 100
  }
}
