import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Dimensions, ScrollView } from 'react-native';
import { IScreenProps } from '../shared/apitypes';
import { Play } from '../components/svgs';
import Container from '../components/Container';
import { H2 } from '../components/Headers';
import Text from '../components/Text';
import Button from '../components/Button';
import StoryContainer from '../components/StoryContainer';
import { sendRequest, saveAccessTimestamp } from 'utils/index';
import { style } from './StoryInfoScreen.style';
import { setUser } from '../stores';
import StoryImage from 'components/StoryImage';
import useRequest from 'utils/hooks/useRequest';

export default function StoryInfoScreen({ navigation, route }: IScreenProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.storeSlice.user);
  const currentStory = useSelector((state: any) => state.storeSlice.currentStory);
  const [storyAlreadyAdded, setStoryAlreadyAdded] = useState(false);
  const [showConfirmAddToLibrary, setShowConfirmAddToLibrary] = useState(false);
  const [loadingAddToLibrary, setLoadingAddToLibrary] = useState(false);

  const windowWidth = Dimensions.get('window').width;

  const storyQuery = useRequest({
    queryKey: ['stories', currentStory._id],
    url: `/stories/${currentStory._id}`,
  })

  const addStoryToUser: any = useRequest({
    url: '/userStoryTextMessages',
    method: 'POST',
    body: { storyId: currentStory._id },
  })

  useEffect(() => {
    if (user.stories.includes(currentStory._id)) {
      setStoryAlreadyAdded(true);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={{ fontSize: 20}}>{currentStory.name}</Text>
    });
  }, [navigation, route]);

  useEffect(() => {
    if (addStoryToUser.data) {
      dispatch(setUser(addStoryToUser.data.user));
      navigation.navigate('ConfirmPurchase', {
        firstMessage: addStoryToUser.data.firstMessage,
      });
    }
  }, [addStoryToUser.data])

  const addToLibrary = async () => {
    setLoadingAddToLibrary(true);
    await addStoryToUser.mutateAsync();
    setLoadingAddToLibrary(false);
  };

  const goToStory = async () => {
    await saveAccessTimestamp(user._id, currentStory._id);
    navigation.navigate({
      name: 'StoryHome',
    });
  }

  const story = storyQuery.data || currentStory;

  return (
    <ScrollView style={{ backgroundColor: '#f7f7f8' }}>
      <View style={{ width: '100%', height: windowWidth }}>
        <StoryImage
          story={story}
          panelWidth={windowWidth}
          storyTitleStyle={{ fontSize: 32, fontFamily: 'Niveau_smallCaps' }}
          storyAuthorStyle={{ fontSize: 26, fontFamily: 'Niveau_smallCaps' }}
        />
      </View>
      <Container>
        {
          !storyAlreadyAdded && <>
            {
              !showConfirmAddToLibrary &&
              <Button buttonStyle={{marginTop: 16, marginBottom: 24}} onPress={() => setShowConfirmAddToLibrary(true)}>
                Add to Library (Free)
              </Button>
            }
            {
              showConfirmAddToLibrary &&
              <View>
                <Text style={{ marginTop: 16 }}>Add {story.name} to your library for $0.00?</Text>
                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Button type={'empty'} buttonStyle={{flex:1, marginTop: 8, marginBottom: 24, marginRight: 8}} onPress={() => setShowConfirmAddToLibrary(false)}>
                    Nope
                  </Button>
                  <Button
                    buttonStyle={{flex:1, marginTop: 8, marginBottom: 24, marginLeft: 8}}
                    onPress={addToLibrary}
                    loading={loadingAddToLibrary}
                  >
                    Yes! Add it!
                  </Button>
                </View>
              </View>
            }
          </>
        }
        {
          storyAlreadyAdded &&
          <Button buttonStyle={{marginTop: 16, marginBottom: 24}} onPress={goToStory}>
            Go to Story!
          </Button>
        }
      </Container>
      <StoryContainer>
        <Container>
          <H2>Summary</H2>
          <Text>
            {story.description}
          </Text>
        </Container>
      </StoryContainer>
      <StoryContainer>
        <Container>
          <H2>Information</H2>
        </Container>
      </StoryContainer>
      <StoryContainer>
        <Container>
          <H2>Review</H2>
        </Container>
      </StoryContainer>
    </ScrollView>
  )
}
