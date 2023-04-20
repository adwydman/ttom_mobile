import { useRef, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { View, ImageBackground, Image, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { sendRequest, useInterval, generateAvailableConversations, isDateWithinLastMinute, isMainCharacter } from 'utils/index';
import CatSteps from 'components/CatSteps';
import StoryFrame from './StoryFrame';
import { IScreenProps } from '../../shared/apitypes';
import Text from '../../components/Text'
import LoadingSplash from 'components/LoadingSplash';
import { colors } from '../../colors'
import { setTextMessages, setRawMessages, setStoryPhotos } from '../../stores';
import { style } from './StoryHomeScreen.style';

async function saveMessages(messageKey, messagesData) {
  const timestamp = new Date().getTime();
  const keyWithTimestamp = `messages_${messageKey}_${timestamp}`;
  try {
    await AsyncStorage.setItem(keyWithTimestamp, JSON.stringify(messagesData));
  } catch (error) {
    console.error('Error saving message:', error);
  }
}

async function schedulePushNotification(title, body, data) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, },
    trigger: { seconds: 1 },
  });
}

export default function StoryHomeScreen({ navigation, route }: IScreenProps) {
  const [unreadTextMessagesCount, setUnreadTextMessagesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userToken = useSelector((state: any) => state.storeSlice.userToken);
  const currentStory = useSelector((state: any) => state.storeSlice.currentStory);
  const rawMessages = useSelector((state: any) => state.storeSlice.rawMessages);
  const storyPhotos = useSelector((state: any) => state.storeSlice.storyPhotos);
  const currentScreenName = useSelector((state: any) => state.storeSlice.currentScreenName);
  // const [visibleMessages, setVisibleMessages] = useState([]);
  const firstRun = useRef(true);
  const visibleMessages = useRef([]);

  const fetchTextMessages = async () => {
    const [result] = await sendRequest(`/userStoryTextMessages?storyId=${currentStory._id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });
    const {
      userStoryTextMessages,
      userPhotos
    } = result;

    dispatch(setRawMessages(userStoryTextMessages));
    dispatch(setStoryPhotos(userPhotos));
  }

  const retrieveMessages = async () => {
    await fetchTextMessages();
  };

  const prefetchImages = async () => {
    const loadImages = storyPhotos.map(image => Image.prefetch(image.url));
    await Promise.all(loadImages);
  };

  useEffect(() => {
    const asyncFn = async () => {
      setLoading(true);
      await retrieveMessages();
      await prefetchImages();
      setLoading(false);
    }

    asyncFn();
  }, []);

  const handleMessages = useCallback(async () => {
    if (rawMessages && currentStory) {
      const [parsedConversations, totalAvailableMessages, newVisibleMessages] = generateAvailableConversations(rawMessages);

      if (!firstRun.current) {
        const numberOfNewMessages = newVisibleMessages.length - visibleMessages.current.length;
        if (numberOfNewMessages > 0) {
          const lastNewMessage = newVisibleMessages[newVisibleMessages.length - 1];
          if (currentScreenName !== lastNewMessage.whoFrom && isDateWithinLastMinute(lastNewMessage.enabledAt)) {
            const contactName = isMainCharacter(lastNewMessage.whoFrom) ? lastNewMessage.whoTo : lastNewMessage.whoFrom;
            const title = isMainCharacter(lastNewMessage.whoFrom) ? `Sent to ${contactName}` : contactName;
            
            schedulePushNotification(title, lastNewMessage.message, { contactName });
          }
        }
      } else {
        firstRun.current = false;
      }

      visibleMessages.current = newVisibleMessages;

      setUnreadTextMessagesCount(totalAvailableMessages);
      dispatch(setTextMessages(parsedConversations));
      await saveMessages(currentStory._id, rawMessages);
    }
  }, [rawMessages, currentStory, currentScreenName]);
  
  useInterval(() => {
    handleMessages();
  }, 1000);
  
  useEffect(() => {
    handleMessages();
  }, [handleMessages]);;

  // I'm gonna have to fetch the story info from the backend
  // when the user gets a notification


  // to do
  // fetch all applicable apps and enable them based on the data
  const data = [
    {
      name: 'Messages',
      imagePath: require('../../assets/images/icons/Message.png'),
      backgroundColor: colors.blue,
      notificationCount: unreadTextMessagesCount,
      onPress: () => {
        navigation.navigate('StoryMessages')
      }
    },
    // {
    //   name: 'Email',
    //   imagePath: require('../../assets/images/icons/Email.png'),
    //   backgroundColor: colors.orange,
    // },
    ...(storyPhotos.length ? [{
        name: 'Photos',
        imagePath: require('../../assets/images/icons/Photos.png'),
        backgroundColor: colors.lightBlue,
        onPress: () => {
          navigation.navigate('StoryPhotos');
        }
      }] : []
    ),
    // {
    //   name: 'Map',
    //   imagePath: require('../../assets/images/icons/Map.png'),
    //   backgroundColor: colors.grey,
    // },
    // {
    //   name: 'Music',
    //   imagePath: require('../../assets/images/icons/Music.png'),
    //   backgroundColor: colors.white,
    // },
    // {
    //   name: 'Notepad',
    //   imagePath: require('../../assets/images/icons/Notepad.png'),
    //   backgroundColor: colors.lightBlue,
    // },
    // {
    //   name: 'Calendar',
    //   imagePath: require('../../assets/images/icons/Calendar.png'),
    //   backgroundColor: colors.yellow,
    // },
    // {
    //   name: 'Internet',
    //   imagePath: require('../../assets/images/icons/Internet.png'),
    //   backgroundColor: colors.white,
    // },
    // {
    //   name: 'Phone',
    //   imagePath: require('../../assets/images/icons/Phone.png'),
    //   backgroundColor: colors.white,
    // },
    // {
    //   name: 'Clock',
    //   imagePath: require('../../assets/images/icons/Clock.png'),
    //   backgroundColor: colors.yellow,
    // },
  ]

  if (loading) {
    return <LoadingSplash />
  }

  return (
    <StoryFrame navigation={navigation} route={route}>
      <ImageBackground
        style={style.backgroundImage}
        source={{ uri: currentStory.picture }}
      >
        <View style={style.blackOverlay}></View>
        <View style={style.iconContainer}>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <>
                <TouchableOpacity style={style.iconWrapper} onPress={item.onPress}>
                  <View style={{ backgroundColor: item.backgroundColor, ...style.iconBackground}}></View>
                  <Image style={style.icon} source={item.imagePath}/>

                  {
                    Boolean(item.notificationCount) &&
                    <>
                      <CatSteps catStepsStyle={{ bottom: -65 }} style={{ transform: [ { rotate: '335deg'} ] }}/>
                      <View style={style.notification}>
                        <Text style={style.notificationText}>{item.notificationCount}</Text>
                      </View>
                    </>
                  }
                  <Text style={style.iconName}>{item.name}</Text>
                </TouchableOpacity>
              </>
            )}
            keyExtractor={item => item.name}
            numColumns={4}
          />
        </View>
      </ImageBackground>
    </StoryFrame>
  )
}
