import { colors } from '../../colors';

export const style = {
  backgroundImage: {
    flex: 1,
    position: 'relative'
  },
  blackOverlay: {
    position: 'absolute',
    backgroundColor: 'black',
    flex: 1,
    opacity: 0.5,
    height: '100%',
    width: '100%'
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: '15%',
    flexWrap: 'wrap'
  },
  iconWrapper: {
    flex: 1/4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBackground: {
    position: 'absolute',
    top: 13,
    height: 60,
    width: 60,
    borderRadius: 1000
  },
  icon: {
    marginTop: 16
  },
  iconName: {
    marginTop: 16,
    color: colors.white,
    fontFamily: 'Niveau_smallCaps'
  },
  footer: {
    paddingTop: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  notification: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: colors.pinkyOrange,
    borderRadius: 2000,
    justifyContent: 'center',
    alignItems: 'center',
    top: 8,
    right: 20
  },
  notificationText: {
    color: colors.white,
  }
}
