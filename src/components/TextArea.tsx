import { View } from 'react-native';
import { style as textAreaStyle } from './TextArea.style';

interface IProps {
  children: any;
  style?: any;
}

export default function TextArea({ children, style = {} }: IProps) {
  return (
    <View style={{...textAreaStyle.textArea, ...style}}>
      {children}
    </View>
  )
}
