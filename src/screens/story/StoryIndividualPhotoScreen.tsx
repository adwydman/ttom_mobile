import { View, Dimensions, StyleSheet, ImageBackground, Image } from 'react-native';
import { useSelector } from 'react-redux';
import StoryFrame from './StoryFrame';
import { IScreenProps } from 'shared/apitypes';
import { style } from './StoryPhotosScreen.style';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
  },
});

export default function StoryIndividualPhotoScreen({ navigation, route }: IScreenProps) {
  const { params: { photoUrl } } = route;

  return (
    <StoryFrame navigation={navigation} route={route}>
      <View style={styles.container}>
        <Image
          source={{ uri: photoUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </StoryFrame>
  )
}
