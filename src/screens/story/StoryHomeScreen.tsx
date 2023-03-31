import { useState, useEffect } from 'react';
import { flatten } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { View, ImageBackground, Image, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { buildUrl, useInterval } from 'utils/index';
import CatSteps from 'components/CatSteps';
import StoryFrame from './StoryFrame';
import { IScreenProps } from '../../shared/apitypes';
import Text from '../../components/Text'
import LoadingSplash from 'components/LoadingSplash';
import { colors } from '../../colors'
import { setTextMessages } from '../../stores';
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

const generateConversationClusters = (userStoryTextMessages, story) => {
  let previousContactName = null;
  return userStoryTextMessages.reduce((acc, message, index, array) => {
    const contactName = message.whoFrom === story.mainCharacter ? message.whoTo : message.whoFrom;

    if (!acc[contactName]) {
      acc[contactName] = [];
    }

    const conversation = acc[contactName];

    let cluster;
    if (previousContactName !== contactName) {
      cluster = [];
      conversation.push(cluster);

      if (!previousContactName) { // first cluster should always be visible
        cluster.__canBeDisplayed__ = true;
      } else {
        const previousMessage = array[index - 1];

        cluster.__canBeDisplayed__ = previousMessage.seenByUser;
      }
    } else {
      cluster = conversation[conversation.length - 1];
    }

    cluster.push(message);

    previousContactName = contactName

    return acc;
  }, {})
};

const generateAvailableConversations = (userStoryTextMessages, story) => {
  const conversationClusters = generateConversationClusters(userStoryTextMessages, story);

  let totalAvailableMessages = 0;
  const parsedConversations = {};
  Object.keys(conversationClusters).forEach((contactName) => {
    const clusters = conversationClusters[contactName];

    const availableClusters = clusters.filter((c) => c.__canBeDisplayed__);
    const availableMessages = flatten(availableClusters);

    if (availableMessages.length > 0) {
      const unreadMessagesCount = availableMessages.filter((m) => !m.seenByUser).length;

      totalAvailableMessages += unreadMessagesCount;
      parsedConversations[contactName] = availableMessages;
    }
  })

  return [parsedConversations, totalAvailableMessages];
}

export default function StoryHomeScreen({ navigation, route }: IScreenProps) {
  const [unreadTextMessages, setUnreadTextMessages] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userToken = useSelector((state: any) => state.storeSlice.userToken);
  const currentStory = useSelector((state: any) => state.storeSlice.currentStory);

  const fetchTextMessages = async () => {
    const fetchResult = await fetch(buildUrl(`/userStoryTextMessages?userToken=${userToken}&storyId=${currentStory._id}`));
    const result = await fetchResult.json();
    const userStoryTextMessages = result.data;

    const [parsedConversations, totalAvailableMessages] = generateAvailableConversations(userStoryTextMessages, currentStory);

    setUnreadTextMessages(totalAvailableMessages);
    dispatch(setTextMessages(parsedConversations));
    await saveMessages(currentStory._id, userStoryTextMessages);
  }

  const retrieveMessages = async () => {
    setLoading(true);
    const allKeys = await AsyncStorage.getAllKeys();

    const relevantKey = allKeys.find((key) => key.includes(currentStory._id));

    if (relevantKey) {
      const messagesString = await AsyncStorage.getItem(relevantKey);
      const messages = JSON.parse(messagesString);

      const [parsedConversations, totalAvailableMessages] = generateAvailableConversations(messages, currentStory);
      setUnreadTextMessages(totalAvailableMessages);
      dispatch(setTextMessages(parsedConversations));
    } else {
      await fetchTextMessages();
    }

    setLoading(false);
  };

  useEffect(() => {
    retrieveMessages();
  }, []);  

  useInterval(() => {
    retrieveMessages();
  }, refreshTime)

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
