import { View, StyleSheet } from 'react-native';
import { colors } from '../colors';

export const styles = StyleSheet.create({
  textArea: {
    backgroundColor: colors.white,
    paddingBottom: 16,
    marginBottom: 20
  }
})

interface IProps {
  children: any;
  style?: any;
}

export default function StoryContainer({ children, style = {} }: IProps) {
  return (
    <View style={{...styles.textArea, ...style}}>
      {children}
    </View>
  )
}
