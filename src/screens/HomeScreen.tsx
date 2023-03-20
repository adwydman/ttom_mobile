import { useState, useEffect } from 'react';
import { Platform, View, Image, FlatList, Pressable } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import { IScreenProps } from '../shared/apitypes';
import { buildUrl } from 'utils/index';
import { style } from './HomeScreen.style';
import Text from '../components/Text';
import { H1, H3 } from 'components/Headers';
import Container from 'components/Container';
import OwnedStory from 'components/OwnedStory';
import LibraryStory from 'components/LibraryStory';
import LibraryStorySkeleton from 'components/skeletons/LibraryStorySkeleton';
import { setCurrentStory } from 'stores/index';

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
    <View style={viewStyle}>
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
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.storeSlice.user);
  const userToken = useSelector((state: any) => state.storeSlice.userToken);
  const currentStory = useSelector((state: any) => state.storeSlice.currentStory);

  console.log('user', user)

  Notifications.addNotificationResponseReceivedListener(response => {
    const { contactName, story } = response.notification.request.content.data

    navigation.navigate('StoryConversation', {
      screenTitle: contactName,
      story: story,
    })
  });

  useEffect(() => {
    const asyncFn = async () => {
      setIsFetchingStories(true);
      // todo: add storiesSimple route to minimize the amount of data to transfer
      const fetchResult = await fetch(buildUrl(`/stories?userToken=${userToken}`))
      const stories = await fetchResult.json();

      const filteredStories = stories.filter((story) => !user.stories.includes(story._id));
      const userPurchasedStories = stories.filter((story) => user.stories.includes(story._id));

      // const onlyBestFriends = result.filter((story) => story.name === 'Best Friends'); // todo: remove
      
      // setTimeout(() => {
      setDisplayableStories(filteredStories);
      setPurchasedStories(userPurchasedStories);
      setIsFetchingStories(false);
      // }, 10000)
    }

    asyncFn();
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (currentStory) {
        dispatch(setCurrentStory({}));
      }
    });

    return unsubscribe;
  }, [navigation, currentStory]);

  return (
    <View style={{ backgroundColor: '#f7f7f8', position: 'relative' }}>
      <FlatList
        ListHeaderComponent={
          <>
            {
              purchasedStories && <>
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
              // isFetchingStories && <LibraryStorySkeleton />
            }
            {
              displayableStories.map((story: any) => <LibraryStory
                  key={story.name}
                  story={story}
                  navigation={navigation}
                />
              )
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
