import { Image, FlatList, Dimensions, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import StoryFrame from './StoryFrame';
import { IScreenProps } from 'shared/apitypes';
import { style } from './StoryPhotosScreen.style';

export default function StoryPhotosScreen({ navigation, route }: IScreenProps) {
  const storyPhotos = useSelector((state: any) => state.storeSlice.storyPhotos);

  const windowWidth = Dimensions.get('window').width;
  const imageWidth = windowWidth / 3;

  return (
    <StoryFrame navigation={navigation} route={route}>
      <FlatList
        data={storyPhotos}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => {
            navigation.navigate('StoryIndividualPhoto', {
              photoUrl: item.url,
            })
          }}>
            <Image
              source={{ uri: item.url }}
              style={{
                ...style.image,
                width: imageWidth,
                height: imageWidth,
                marginTop: [0, 1, 2].includes(index) ? 0 : 1,
                marginLeft: index % 3 === 0 ? 0 : 1,
                marginRight: index % 3 === 2 ? 0 : 1,
              }} 
            />
          </Pressable>
        )}
        keyExtractor={item => item._id}
        numColumns={3}
        columnWrapperStyle={style.row}
      />
    </StoryFrame>
  )
}
