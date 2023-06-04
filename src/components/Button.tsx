import { useMemo } from 'react';
import { StyleSheet, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import Text from './Text';
import { colors } from '../colors';

type ButtonType = 'filled' | 'empty' | 'link';

interface IProps {
  image?: React.ReactNode;
  onPress?: any;
  children: any;
  textStyle?: any;
  buttonStyle?: any;
  type?: ButtonType;
  loading?: boolean;
  disabled?: boolean;
}

const styles = StyleSheet.create({
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
  buttonLink: {
    borderWidth: 0,
    height: 24
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
  },
  textLink: {
    color: colors.blue
  }
});

const getButtonStyles = (type: ButtonType) => {
  let buttonTypeStyle = {};
  let textTypeStyle = {};
  if (type === 'filled') {
    buttonTypeStyle = styles.buttonFilled;
    textTypeStyle = styles.textFilled;
  } else if (type === 'empty') {
    buttonTypeStyle = styles.buttonEmpty;
    textTypeStyle = styles.textEmpty;
  } else if (type === 'link') {
    buttonTypeStyle = styles.buttonLink;
    textTypeStyle = styles.textLink;
  }

  return { buttonTypeStyle, textTypeStyle };
}


export default function Button(props: IProps) {
  const {
    image = null,
    children,
    buttonStyle = {},
    textStyle = {},
    type = 'filled',
    onPress = () => {},
    loading,
    disabled,
  } = props;

  const { buttonTypeStyle, textTypeStyle } = useMemo(() => getButtonStyles(type), [type]);

  const touchableOpacityStyle = {
    ...buttonStyle,
    ...styles.button,
    ...buttonTypeStyle
  };

  let loadingIndicatorStyle = {};

  if (loading && Platform.OS === 'ios') {
    loadingIndicatorStyles.paddingTop = 6;
  }

  const buttonContent = loading ? <ActivityIndicator style={loadingIndicatorStyle} /> : children;

  return (
    <TouchableOpacity style={touchableOpacityStyle} onPress={onPress} disabled={disabled || loading}>
      {image}
      <Text style={{...textStyle, ...styles.text, ...textTypeStyle}}>
        {buttonContent}
      </Text>
    </TouchableOpacity>
  )
}
