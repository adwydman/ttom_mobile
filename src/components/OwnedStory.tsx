import { ImageBackground, View, Dimensions, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Container from 'components/Container';
import Text from 'components/Text';
import StoryImage from './StoryImage';
import { style } from './OwnedStory.style';
import { setCurrentStory } from 'stores/index';

interface IOwnedStory {
  story: any;
  navigation: any;
}

export default function OwnedStory({ story, navigation }: IOwnedStory) {
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.storeSlice.user);
  const storyInfo = user.storyInfo.find(({ storyId }) => storyId === story._id)

  const unreadMessagesCount = storyInfo.availableMessagesCount - storyInfo.seenMessagesCount;
  const displayedUnreadCount = unreadMessagesCount > 20 ? '20+' : unreadMessagesCount;

  const completedPercentage = 100 * storyInfo.seenMessagesCount / storyInfo.messagesCount;
  const roundedCompleted = completedPercentage >= 99 ? 99 : Math.round(completedPercentage);

  // const roundedCompleted = 88
  // console.log('roundedCompleted', roundedCompleted)

  const windowWidth = Dimensions.get('window').width;
  const panelWidth = windowWidth / 2.25
  
  return (
    <Pressable key={story.name} onPress={() => {
      dispatch(setCurrentStory(story));
      navigation.navigate({
        name: 'StoryInfo',
      })
    }}>
      <Container style={{ ...style.ownerStoryContainer, width: panelWidth }}>
        <View style={{ height: panelWidth, width: panelWidth }}>
          <StoryImage
            story={story}
            panelWidth={panelWidth}
          />
        </View>
        <View style={style.progressContainer}>
          <View style={style.unreadMessagesContainer}>
            <View style={style.unreadMessagesBackground}>
              <Text style={style.unreadMessagesFont}>{displayedUnreadCount}</Text>
            </View>
            <Text style={style.unreadMessagesFont}> Unread Texts</Text>
          </View>
          <View style={style.percentageProgressContainer}>
            <Text style={style.percentageFont}>{roundedCompleted}%</Text>
            <View style={style.percentageBarContainer}>
              <View style={{...style.percentageBar, width: `${roundedCompleted}%`}}></View>
            </View>
          </View>
        </View>
      </Container>
    </Pressable>
  )
}