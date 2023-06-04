import { View, Dimensions, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, LinearProgress } from '@rneui/themed';
import Text from 'components/Text';
import StoryImage from './StoryImage';
import { setCurrentStory } from 'stores/index';
import StoryCard from 'components/StoryCard';
import { colors } from '../colors';

interface IOwnedStory {
  story: any;
  navigation: any;
  isFirst?: boolean;
  isLast?: boolean;
}

const styles = StyleSheet.create({
  ownerStoryContainer: {
    marginBottom: 8,
    marginRight: 12,
    marginLeft: 12,
    paddingBottom: 8
  },
  firstOwnedStory: {
    marginLeft: 0
  },
  lastOwnedStory : {
    marginRight: 0
  },
  progressContainer: {
    marginTop: 4,
    marginLeft: 6,
    marginRight: 6
  },
  unreadMessagesContainer: {
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  unreadMessagesBackground: {
    backgroundColor: colors.pinkyOrange, 
  },
  unreadMessagesFont: {
    fontSize: 11,
    color: 'black',
    fontFamily: 'NiveauGroteskLight'
  },
  percentageProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageFont: {
    fontSize: 12,
    marginRight: 4
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBar: {
    height: 8, 
    borderRadius: 100
  }
})


export default function OwnedStory({ story, navigation, isFirst, isLast }: IOwnedStory) {
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.storeSlice.user);
  if (!user) {
    return null;
  }

  const storyInfo = user.storyInfo.find(({ storyId }) => storyId === story._id)

  const unreadMessagesCount = storyInfo.availableMessagesCount - storyInfo.seenMessagesCount;
  const displayedUnreadCount = unreadMessagesCount > 20 ? '20+' : unreadMessagesCount;

  const completedPercentage = 100 * storyInfo.seenMessagesCount / storyInfo.messagesCount;
  const roundedCompleted = completedPercentage >= 99 ? 100 : Math.round(completedPercentage);

  const windowWidth = Dimensions.get('window').width;
  const panelWidth = windowWidth / 2.5;

  const firstOwnedStoryStyle = isFirst ? styles.firstOwnedStory : {};
  const lastOwnedStoryStyle = isLast ? styles.lastOwnedStory : {};
  
  return (
    <StoryCard
      onPress={() => {
        dispatch(setCurrentStory(story));
        navigation.navigate('StoryInfo');
      }}
      style={{ ...styles.ownerStoryContainer, width: panelWidth, ...firstOwnedStoryStyle, ...lastOwnedStoryStyle }}
    >
      <View style={{ height: panelWidth, width: panelWidth }}>
        <StoryImage
          story={story}
          panelWidth={panelWidth}
        />
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.unreadMessagesContainer}>
          {
            roundedCompleted === 100 ?
              <View style={{ marginTop: 3}}>
                <Text style={styles.unreadMessagesFont}>Story Completed!</Text>
              </View> :
              <>
                <Avatar
                  size={16}
                  rounded
                  title={displayedUnreadCount}
                  titleStyle={styles.unreadMessagesFont}
                  containerStyle={styles.unreadMessagesBackground}
                />
                <Text style={styles.unreadMessagesFont}> Unread Texts</Text>
              </>
          }
        </View>
        <View style={styles.percentageProgressContainer}>
          <Text style={styles.percentageFont}>{roundedCompleted}%</Text>
          <View style={styles.progressBarContainer}>
            <LinearProgress
              animation={{ duration: 500 }}
              value={roundedCompleted/100}
              color={colors.blue}
              trackColor={colors.offWhite1}
              style={styles.progressBar}
            />
          </View>
        </View>
      </View>
    </StoryCard>
  )
}
