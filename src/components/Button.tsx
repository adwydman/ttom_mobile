import { TouchableOpacity } from 'react-native';
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
}


export default function Button(props: IProps) {
  const {
    image = null,
    children,
    buttonStyle = {},
    textStyle = {},
    type = 'filled',
    onPress = () => {},
    loading
  } = props;

  const buttonTypeStyle = type === 'filled' ? style.buttonFilled : style.buttonEmpty;
  const textTypeStyle = type === 'filled' ? style.textFilled : style.textEmpty;

  let touchableOpacityStyle = {
    ...buttonStyle,
    ...style.button,
    ...buttonTypeStyle
  };

  if (loading) {
    touchableOpacityStyle = {
      ...touchableOpacityStyle,
      ...style.buttonDisabled
    }
  }

  const buttonContent = loading ? 'Loading...' : children;

  return (
    <TouchableOpacity style={touchableOpacityStyle} onPress={onPress} disabled={loading}>
      { image }
      <Text style={{...textStyle, ...style.text, ...textTypeStyle}}>
        {buttonContent}
      </Text>
    </TouchableOpacity>
  )
}
