import { TouchableOpacity } from 'react-native';
import Text from './Text';
import { style } from './Button.style';

interface IProps {
  image?: React.ReactNode;
  onPress?: any;
  children: any;
  textStyle?: any;
  buttonStyle?: any;
  type?: 'filled' | 'empty'
}


export default function Button({ image = null, children, buttonStyle = {}, textStyle = {}, type = 'filled', onPress = () => {} }: IProps) {
  const buttonTypeStyle = type === 'filled' ? style.buttonFilled : style.buttonEmpty;
  const textTypeStyle = type === 'filled' ? style.textFilled : style.textEmpty;

  return (
    <TouchableOpacity style={{...buttonStyle, ...style.button, ...buttonTypeStyle}} onPress={onPress}>
      { image }
      <Text style={{...textStyle, ...style.text, ...textTypeStyle}}>{children}</Text>
    </TouchableOpacity>
  )
}
