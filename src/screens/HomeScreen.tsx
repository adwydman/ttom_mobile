import { useState, useEffect } from 'react';
import { ImageBackground, View, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { FontAwesome } from '@expo/vector-icons';
import { IScreenProps } from '../shared/apitypes';
import { buildUrl } from 'utils/index';
import { style } from './HomeScreen.style';
import Text from '../components/Text';
import TextArea from '../components/TextArea';
import { H1, H3 } from '../components/Headers';
import Container from '../components/Container';

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

export function HomeHeader() {
  return (
    <View style={style.homeHeader}>
      <FontAwesome style={{ fontSize: 24 }} name={'user'} />
      <FontAwesome style={{ fontSize: 24 }} name={'search'} />
    </View>
  );
}

export default function HomeScreen({ navigation, route }: IScreenProps) {
  Notifications.addNotificationResponseReceivedListener(response => {
    console.log('response.notification.request.content.data', response.notification.request.content.data)
    const { contactName, story } = response.notification.request.content.data

    navigation.navigate('StoryConversation', {
      screenTitle: contactName,
      story: story,
    })
  });

  const [fetchedStories, setFetchedStories] = useState([]);

  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    fetch(buildUrl('/stories?userToken=1234'))
      .then(res => res.json())
      .then((resStories) => {
        setFetchedStories(resStories);
      });
  }, [])

  // add loading screen

  return (
    <View style={{ backgroundColor: '#f7f7f8' }}>
      <FlatList
        ListHeaderComponent={
          <>
            <Container>
              <H1>Browse Stories</H1>
            </Container>
            {
              fetchedStories.map((story) => {
                return (
                  <TouchableOpacity key={story.name} onPress={() => {
                    navigation.navigate({
                      name: 'StoryInfo',
                      params: story
                    })
                  }}>
                    <TextArea>
                      <View style={{ width: '100%', height: windowWidth }}>
                        <ImageBackground  
                          style={style.imageCover}
                          source={{uri: story.picture }}
                        >
                          <Container>
                            <Text style={style.storyTitle}>{story.name}</Text>
                            <Text style={style.storyAuthor}>by {story.author}</Text>
                          </Container>
                        </ImageBackground>
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
                  </TouchableOpacity>
                )
              })
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
