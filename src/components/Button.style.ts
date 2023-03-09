import { colors } from '../colors';

export const style = {
  button: {
    borderWidth: 2,
    borderColor: colors.blue,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    borderColor: colors.disabledBlue,
    backgroundColor: colors.disabledBlue
  },
  buttonFilled: {
    backgroundColor: colors.blue,
  },
  buttonEmpty: {
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 18,
    lineHeight: 24
  },
  textFilled: {
    color: colors.white,
  },
  textEmpty: {
    color: colors.blue,
  }
}
