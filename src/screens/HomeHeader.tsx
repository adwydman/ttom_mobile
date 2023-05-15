import { Platform, View, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { style } from './HomeScreen.style';

export default function HomeHeader({ navigation }) {
  const viewStyle = {
    ...style.homeHeader
  } as any;

  if (Platform.OS === 'ios') {
    viewStyle.marginTop = 40;
  } else if (Platform.OS === 'android') {
    viewStyle.marginTop = 8;
    viewStyle.marginBottom = 8;
  }

  return (
    <View style={viewStyle} testID="home-header">
      <Pressable style={{ width: 40 }} onPress={() => { navigation.openDrawer(); }}>
        <FontAwesome style={{ fontSize: 24 }} name={'user'} />
      </Pressable>
      {/* todo: comment this out for now */}
      {/* <FontAwesome style={{ fontSize: 24 }} name={'search'} /> */}
    </View>
  );
}
