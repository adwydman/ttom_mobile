import { Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import Text from './Text';
import { style } from './Button.style';

interface IProps {
  image?: React.ReactNode;
  onPress?: any;
  children: any;
  textStyle?: any;
  buttonStyle?: any;
  type?: 'filled' | 'empty';
  loading?: boolean;
  disabled?: boolean;
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

  const buttonTypeStyle = type === 'filled' ? style.buttonFilled : style.buttonEmpty;
  const textTypeStyle = type === 'filled' ? style.textFilled : style.textEmpty;

  const touchableOpacityStyle = {
    ...buttonStyle,
    ...style.button,
    ...buttonTypeStyle
  };

  let loadingIndicatorStyle = {};

  if (loading && Platform.OS === 'ios') {
    loadingIndicatorStyle.paddingTop = 6;
  }

  const buttonContent = loading ? <ActivityIndicator style={loadingIndicatorStyle} /> : children;

  return (
    <TouchableOpacity style={touchableOpacityStyle} onPress={onPress} disabled={disabled || loading}>
      {image}
      <Text style={{...textStyle, ...style.text, ...textTypeStyle}}>
        {buttonContent}
      </Text>
    </TouchableOpacity>
  )
}
