import { View, Dimensions } from 'react-native';
import { Skeleton } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';

export default function LibraryStorySkeleton() {
  const windowWidth = Dimensions.get('window').width;

  return (
    <View>
      <Skeleton
        animation="wave"
        height={windowWidth}
        LinearGradientComponent={LinearGradient}
      />
      <View
        style={{
          marginTop: 12 
        }}
      >
        <Skeleton
          animation="wave"
          LinearGradientComponent={LinearGradient}
          height={24}
          width={windowWidth/2}
        />
      </View>
      <View
        style={{
          marginTop: 4 
        }}
      >
        <Skeleton
          animation="wave"
          LinearGradientComponent={LinearGradient}
          height={24}
          width={windowWidth/1.3}
        />
      </View>
      <View
        style={{
          marginTop: 4,
          marginBottom: 12
        }}
      >
        <Skeleton
          animation="wave"
          LinearGradientComponent={LinearGradient}
          height={24}
          width={windowWidth/1.1}
        />
      </View>
    </View>
  )
}
