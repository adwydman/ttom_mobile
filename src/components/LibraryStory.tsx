import { View, Dimensions, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import StoryImage from './StoryImage';
import { style } from './LibraryStory.style';
import Text from 'components/Text';
import { H3 } from 'components/Headers';
import Container from 'components/Container';
import StoryCard from 'components/StoryCard';
import { setCurrentStory } from 'stores/index';

interface IProps {
  story: any;
  navigation: any;
}

const styles = StyleSheet.create({
  notApproved: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
    color: 'red',
    fontSize: 28,
  }
})

export default function LibraryStory({ story, navigation }: IProps) {
  const dispatch = useDispatch();
  const windowWidth = Dimensions.get('window').width;

  return (
    <StoryCard
      onPress={() => {
        dispatch(setCurrentStory(story));
        navigation.navigate('StoryInfo');
      }}
    >
      <View style={{ position: 'relative', width: '100%', height: windowWidth }}>
        { !story.isApproved && <Text style={styles.notApproved}>Not Approved</Text> }
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
    </StoryCard>
  )
}
