import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { View, ImageBackground, Image, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { sendRequest, useInterval, generateAvailableConversations } from 'utils/index';
import CatSteps from 'components/CatSteps';
import StoryFrame from './StoryFrame';
import { IScreenProps } from '../../shared/apitypes';
import Text from '../../components/Text'
import LoadingSplash from 'components/LoadingSplash';
import { colors } from '../../colors'
import { setTextMessages, setRawMessages } from '../../stores';
import { style } from './StoryHomeScreen.style';

const refreshTime = 60 * 60 * 1000 // hour in miliseconds

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
  const [unreadTextMessages, setUnreadTextMessages] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userToken = useSelector((state: any) => state.storeSlice.userToken);
  const currentStory = useSelector((state: any) => state.storeSlice.currentStory);
  const rawMessages = useSelector((state: any) => state.storeSlice.rawMessages);

  const fetchTextMessages = async () => {
    const [result] = await sendRequest(`/userStoryTextMessages?storyId=${currentStory._id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });
    const userStoryTextMessages = result.data;
    dispatch(setRawMessages(userStoryTextMessages));
  }

  const retrieveMessages = async () => {
    setLoading(true);
    await fetchTextMessages();
    setLoading(false);
  };

  useEffect(() => {
    retrieveMessages();
  }, []);  

  useInterval(() => {
    // retrieveMessages();
    const asyncFn = async () => {
      if (rawMessages && currentStory) {
        const [parsedConversations, totalAvailableMessages] = generateAvailableConversations(rawMessages);
    
        setUnreadTextMessages(totalAvailableMessages);
        dispatch(setTextMessages(parsedConversations));
        await saveMessages(currentStory._id, rawMessages);
      }
    }

    asyncFn();
  }, 1000)

  useEffect(() => {
    const asyncFn = async () => {
      if (rawMessages && currentStory) {
        const [parsedConversations, totalAvailableMessages] = generateAvailableConversations(rawMessages);
    
        setUnreadTextMessages(totalAvailableMessages);
        dispatch(setTextMessages(parsedConversations));
        await saveMessages(currentStory._id, rawMessages);
      }
    }

    asyncFn();
  }, [rawMessages, currentStory]);

  // I'm gonna have to fetch the story info from the backend
  // when the user gets a notification


  // to do
  // fetch all applicable apps and enable them based on the data
  const data = [
    {
      name: 'Messages',
      imagePath: require('../../assets/images/icons/Message.png'),
      backgroundColor: colors.blue,
      unreadTextMessages: unreadTextMessages,
      onPress: () => {
        navigation.navigate({
          name: 'StoryMessages',
        })
      }
    },
    // {
    //   name: 'Email',
    //   imagePath: require('../../assets/images/icons/Email.png'),
    //   backgroundColor: colors.orange,
    // },
    // {
    //   name: 'Photos',
    //   imagePath: require('../../assets/images/icons/Photos.png'),
    //   backgroundColor: colors.lightBlue,
    // },
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
    <StoryFrame navigation={navigation}>
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
                    Boolean(unreadTextMessages) &&
                    <>
                      <CatSteps catStepsStyle={{ bottom: -65 }} style={{ transform: [ { rotate: '335deg'} ] }}/>
                      <View style={style.notification}>
                        <Text style={style.notificationText}>{item.unreadTextMessages}</Text>
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
