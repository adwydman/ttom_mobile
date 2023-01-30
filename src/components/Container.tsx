import { View } from 'react-native';

interface IProps {
  children: any;
  style?: any;
}

export default function Container({children, style = {}}: IProps) {
  return <View style={{marginLeft: 12, marginRight: 12, ...style}}>{children}</View>
}
