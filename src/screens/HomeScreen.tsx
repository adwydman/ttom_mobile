import { useState, useEffect } from 'react';
import { View, Image, FlatList } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { focusManager } from '@tanstack/react-query'

import { IScreenProps } from '../shared/apitypes';
import { noAvailableStoriesMessage, sortStoriesByAccess } from 'utils/index';
import Text from '../components/Text';
import { H1 } from 'components/Headers';
import Container from 'components/Container';
import OwnedStory from 'components/OwnedStory';
import LibraryStory from 'components/LibraryStory';
import OwnedStorySkeleton from 'components/skeletons/OwnedStorySkeleton';
import LibraryStorySkeleton from 'components/skeletons/LibraryStorySkeleton';
import { setUser, setCurrentStory, setCurrentScreenName } from 'stores/index';
import useAsyncEffect from 'utils/hooks/useAsyncEffect';
import useRequest from 'utils/hooks/useRequest';

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

const fetchedFields = [
  '_id',
  'name',
  'author',
  'picture',
  'duration',
  'categories',
  'description',
  'mainCharacter',
]

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
  const currentStory = useSelector((state: any) => state.storeSlice.currentStory);
  const { data: stories } = useRequest({
    queryKey: ['stories'],
    url: `/stories?fields=${fetchedFields.join(',')}`,
  });

  useRequest({
    queryKey: ['user'], 
    url: '/users',
    refetchOnScreenFocus: true,
    onSuccess: (data: any) => {
      dispatch(setUser(data.user));
    }
  });

  useEffect(() => {
    Notifications.addNotificationResponseReceivedListener(response => {
      const { contactName } = response.notification.request.content.data
  
      navigation.navigate('StoryConversation', {
        screenTitle: contactName,
      })
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      dispatch(setCurrentScreenName(null));
      if (currentStory) {
        dispatch(setCurrentStory({}));
      }

      focusManager.setFocused(true);
    });

    return unsubscribe;
  }, [navigation, currentStory]);

  useAsyncEffect(async () => {
    if (!user.token || !stories) {
      return; 
    }
    setIsFetchingStories(true);

    // newly bought stories should be displayed first
    const filteredStories = stories.filter((story) => !user.stories.includes(story._id));
    const userPurchasedStories = stories.filter((story) => user.stories.includes(story._id));

    const sortedPurchasedStories = await sortStoriesByAccess(user._id, userPurchasedStories);

    setDisplayableStories(filteredStories);
    setPurchasedStories(sortedPurchasedStories);

    setIsFetchingStories(false);
  }, [user, stories])

  return (
    <View>
      <FlatList
        ListHeaderComponent={
          <>
            {
              purchasedStories.length > 0 && <>
                <Container>
                  <H1>
                    My Stories 
                    <Text style={{fontSize: 20}}> ({purchasedStories.length})</Text>
                  </H1>
                  <FlatList
                    data={purchasedStories}
                    horizontal={true}
                    renderItem={({ item, index }) => {
                      const isFirst = index === 0;
                      const isLast = index === purchasedStories.length - 1;
                      return <OwnedStorySkeleton count={1} isFirst={isFirst} isLast={isLast} />
                      // return <OwnedStory key={item.name} story={item} navigation={navigation} isFirst={isFirst} isLast={isLast} />
                    }}
                  />
                </Container>
              </>
            }
            <Container>
              <H1>Browse Stories</H1>
            </Container>
            {
              <LibraryStorySkeleton count={2}/>
            }
            {/* {
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
            } */}
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
