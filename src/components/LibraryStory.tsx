import { ImageBackground, View, Dimensions, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import StoryImage from './StoryImage';
import { style } from './LibraryStory.style';
import Text from 'components/Text';
import TextArea from 'components/StoryContainer';
import { H3 } from 'components/Headers';
import Container from 'components/Container';
import { setCurrentStory } from 'stores/index';

interface IProps {
  story: any;
  navigation: any;
}

export default function LibraryStory({ story, navigation }: IProps) {
  const dispatch = useDispatch();
  const windowWidth = Dimensions.get('window').width;

  return (
    <Pressable key={story.name} onPress={() => {
      dispatch(setCurrentStory(story));
      navigation.navigate({
        name: 'StoryInfo',
      })
    }}>
      <TextArea
        style={{
          shadowOffset: {width: -2, height: 4},  
          shadowColor: 'black',  
          shadowOpacity: 0.2,  
          shadowRadius: 3,  
        }}
      >
        <View style={{ width: '100%', height: windowWidth }}>
          <StoryImage
            story={story}
            panelWidth={windowWidth}
            storyTitleStyle={{ fontSize: 32, fontFamily: 'Niveau_smallCaps' }}
            storyAuthorStyle={{ fontSize: 26, fontFamily: 'Niveau_smallCaps' }}
          />
        </View>
        <View style={style.storyDetailsWrapper}>
          <Container style={style.storyDetailsHeader}>
            <H3 style={style.storyDetailsHeaderItem}>{story.categories.join(', ')}</H3>
            <H3 style={style.storyDetailsHeaderItem}>{story.duration}</H3>
          </Container>
          <Container>
            <Text>{story.description}</Text>
          </Container>
        </View>
      </TextArea>
    </Pressable>
  )
}
