import { View } from 'react-native';
import { style as textAreaStyle } from './StoryContainer.style';

interface IProps {
  children: any;
  style?: any;
}

export default function StoryContainer({ children, style = {} }: IProps) {
  return (
    <View style={{...textAreaStyle.textArea, ...style}}>
      {children}
    </View>
  )
}
