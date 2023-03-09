import { Text as ReactNativeText } from 'react-native';

interface IProps {
  children: React.ReactNode | string;
  style?: any;
}

export default function Text({children, style}: IProps) {
  return <ReactNativeText style={{fontFamily: 'NiveauGroteskRegular', ...style}}>{children}</ReactNativeText>
}
