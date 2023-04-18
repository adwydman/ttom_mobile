import { useState, useEffect } from 'react';
import { Platform, View, Image, FlatList, Pressable } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import { IScreenProps } from '../shared/apitypes';
import { sendRequest, noAvailableStoriesMessage } from 'utils/index';
import { style } from './HomeScreen.style';
import Text from '../components/Text';
import { H1 } from 'components/Headers';
import Container from 'components/Container';
import OwnedStory from 'components/OwnedStory';
import LibraryStory from 'components/LibraryStory';
import LibraryStorySkeleton from 'components/skeletons/LibraryStorySkeleton';
import { setUser, setCurrentStory, setCurrentScreenName } from 'stores/index';

const extras = [
  {
    id: '1',
    image: require('../assets/images/cookies.png'),
    text: <Text>Try Alex's choclate chip cookie recipe from <Text style={{ fontWeight: 'bold' }}>Roommates</Text>.</Text>
  },
  {
    id: '2',
    image: require('../assets/images/best-friends-spotify.png'),
    text: <Text>Listen to the author's Spotify playlist for <Text style={{ fontWeight: 'bold' }}>Best Friends</Text>.</Text>,
  },
  {
    id: '3',
    image: require('../assets/images/elbo-room.png'),
    text: <Text>Go see a show at the Elbo Room from <Text style={{ fontWeight: 'bold' }}>The Actress and the Painter</Text>.</Text>
  }
]

export function HomeHeader({navigation}) {
  const viewStyle = {
    ...style.homeHeader
  } as any;

  if (Platform.OS === 'ios') {
    viewStyle.marginTop = 40;
  } else if (Platform.OS === 'android') {
    viewStyle.marginTop = 8;
    viewStyle.marginBottom = 8;
  }

  return (
    <View style={viewStyle} testID="home-header">
      <Pressable style={{ width: 40 }} onPress={() => { navigation.openDrawer() }}>
        <FontAwesome style={{ fontSize: 24 }} name={'user'} />
      </Pressable>
      <FontAwesome style={{ fontSize: 24 }} name={'search'} />
    </View>
  );
}

export default function HomeScreen({ navigation }: IScreenProps) {
  const [purchasedStories, setPurchasedStories] = useState([]);
  const [displayableStories, setDisplayableStories] = useState([]);
  const [isFetchingStories, setIsFetchingStories] = useState(false);
  const [noStoriesAvailableMessage] = useState(() => {
    const randomIndex = Math.floor(Math.random() * noAvailableStoriesMessage.length);
    return noAvailableStoriesMessage[randomIndex];
  })
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.storeSlice.user);
  const userToken = useSelector((state: any) => state.storeSlice.userToken);
  const currentStory = useSelector((state: any) => state.storeSlice.currentStory);

  Notifications.addNotificationResponseReceivedListener(response => {
    const { contactName } = response.notification.request.content.data

    navigation.navigate('StoryConversation', {
      screenTitle: contactName,
    })
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      dispatch(setCurrentScreenName(null));
      if (currentStory) {
        dispatch(setCurrentStory({}));
      }

      // fetch user to see if there are any changes to stories
      const [userResult] = await sendRequest('/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      })

      dispatch(setUser(userResult.user));
    });

    return unsubscribe;
  }, [navigation, currentStory]);

  useEffect(() => {
    const asyncFn = async () => {
      setIsFetchingStories(true);

      const fetchedFields = [
        '_id',
        'name',
        'author',
        'picture',
        'duration',
        'categories',
        'description'
      ]
    
      const [stories] = await sendRequest(`/stories?fields=${fetchedFields.join(',')}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      })

      const filteredStories = stories.filter((story) => !user.stories.includes(story._id));
      const userPurchasedStories = stories.filter((story) => user.stories.includes(story._id));
  
      setDisplayableStories(filteredStories);
      setPurchasedStories(userPurchasedStories);

      setIsFetchingStories(false);
    };

    asyncFn();
  }, [user])

  return (
    <View>
      <FlatList
        ListHeaderComponent={
          <>
            {
              purchasedStories.length > 0 && <>
                <Container>
                  <H1>My Stories</H1>
                </Container>
                <FlatList
                  data={purchasedStories}
                  horizontal={true}
                  renderItem={({ item }) => <OwnedStory story={item} navigation={navigation} />}
                />
              </>
            }
            <Container>
              <H1>Browse Stories</H1>
            </Container>
            {
              // !isFetchingStories && <LibraryStorySkeleton />
            }
            {
              displayableStories.length ? 
                displayableStories.map((story: any) => <LibraryStory
                    key={story.name}
                    story={story}
                    navigation={navigation}
                  />
                ) : (() => {
                  return <Container style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text>{noStoriesAvailableMessage}</Text>
                  </Container>
                })()
            }
            <Container>
              <H1>Extras</H1>
            </Container>
          </>
        }
        data={extras}
        renderItem={({ item, index }) => {
          const marginRight = index + 1 === extras.length ? 36 : 12;

          return <Container style={{flex: .5, marginRight: marginRight, marginBottom: 40}}>
            <Image
              style={{ width: "100%", height: 180 }}
              source={item.image}
            />
            <Text style={{ marginTop: 8 }}>{item.text}</Text>
          </Container>
        }}
        keyExtractor={item => item.id}
        numColumns={2}
      />
    </View>
  );
}
