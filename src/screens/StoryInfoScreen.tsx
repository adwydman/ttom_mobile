import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { IScreenProps } from '../shared/apitypes';
import { Play } from '../components/svgs';
import Container from '../components/Container';
import { H2 } from '../components/Headers';
import Text from '../components/Text';
import Button from '../components/Button';
import TextArea from '../components/TextArea';
import { buildUrl } from 'utils/index';
import { style } from './StoryInfoScreen.style';
import { setUser } from '../stores';

export default function StoryInfoScreen({ navigation, route }: IScreenProps) {
  const [storyAlreadyAdded, setStoryAlreadyAdded] = useState(false);
  const [showConfirmAddToLibrary, setShowConfirmAddToLibrary] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.storeSlice.user);
  const userToken = useSelector((state: any) => state.storeSlice.userToken);
  
  const story = route.params;
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (user.stories.includes(story._id)) {
      setStoryAlreadyAdded(true);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text>{story.title}</Text>
    });
  }, [navigation, route]);

  const addToLibrary = async () => {
    const fetchResult = await fetch(buildUrl('/userStoryTextMessages'), {
      method: 'POST',
      body: JSON.stringify({
        storyId: story._id,
        userToken: userToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const result = await fetchResult.json();
    if (result.user) {
      dispatch(setUser(result.user));
    }
      
    navigation.navigate({
      name: 'ConfirmPurchase',
      params: story
    });
  };

  const goToStory = () => {
    navigation.navigate({
      name: 'StoryHome',
      params: story
    });
  }

  return (
    <ScrollView style={{ backgroundColor: '#f7f7f8' }}>
      <View style={{ width: '100%', height: windowWidth }}>
        <ImageBackground  
          style={style.imageCover}
          source={{ uri: story.picture }}
        >
          <Container>
            <Text style={style.storyTitle}>{story.name}</Text>
            <Text style={style.storyAuthor}>by {story.author}</Text>
          </Container>
        </ImageBackground>
      </View>
      <Container>
        {
          !storyAlreadyAdded && <>
            <Button
              type={'empty'}
              image={<Play width={24} height={24} style={{marginRight: 8}}/>}
              buttonStyle={{marginTop: 24}}
            >
              Sample the Story
            </Button>
            {
              !showConfirmAddToLibrary &&
              <Button buttonStyle={{marginTop: 16, marginBottom: 24}} onPress={() => setShowConfirmAddToLibrary(true)}>
                Add to Library (Free)
              </Button>
            }
            {
              showConfirmAddToLibrary &&
              <View>
                <Text style={{ marginTop: 16 }}>Add {story.title} to your library for $0.00?</Text>
                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Button type={'empty'} buttonStyle={{flex:1, marginTop: 8, marginBottom: 24, marginRight: 8}} onPress={() => setShowConfirmAddToLibrary(false)}>
                    Nope
                  </Button>
                  <Button buttonStyle={{flex:1, marginTop: 8, marginBottom: 24, marginLeft: 8}} onPress={addToLibrary}>
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
      <TextArea>
        <Container>
          <H2>Summary</H2>
          <Text>
            {story.description}
          </Text>
        </Container>
      </TextArea>
      <TextArea>
        <Container>
          <H2>Information</H2>
        </Container>
      </TextArea>
      <TextArea>
        <Container>
          <H2>Review</H2>
        </Container>
      </TextArea>
    </ScrollView>
  )
}
