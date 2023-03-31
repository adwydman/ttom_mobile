import { View, Image } from 'react-native';

export default function LoadingSplash() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Image source={require('../assets/loading-cat.gif')} style={{ width: 100, height: 100 }} />
    </View>
  )
}
