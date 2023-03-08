import { useState, useEffect } from 'react';
import { flatten } from 'lodash';
import moment from 'moment';
import * as Notifications from 'expo-notifications';
import { View, ImageBackground, Image, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { buildUrl, useInterval } from 'utils/index';
import CatSteps from 'components/CatSteps';
import StoryFrame from './StoryFrame';
import { IScreenProps } from '../../shared/apitypes';
import Text from '../../components/Text'
import { colors } from '../../colors'
import { setTextMessages } from '../../stores';
import { style } from './StoryHomeScreen.style';

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
  Object.keys(conversationClusters).map((contactName) => {
    const clusters = conversationClusters[contactName];

    const availableClusters = clusters.filter((c) => c.__canBeDisplayed__);
    const availableMessages = flatten(availableClusters);

    if (availableMessages.length > 0) {
      const unreadMessagesCount = availableMessages.filter((m) => !m.seenByUser).length;

      console.log('availableMessages', availableMessages)

      totalAvailableMessages += unreadMessagesCount;
      parsedConversations[contactName] = availableMessages;
    }
  })

  return [parsedConversations, totalAvailableMessages];
}

export default function StoryHomeScreen({ navigation, route }: IScreenProps) {
  const [unreadTextMessages, setUnreadTextMessages] = useState(0);
  const dispatch = useDispatch();
  const userToken = useSelector((state: any) => state.storeSlice.userToken);
  const textMessagesRefetchCounter = useSelector((state: any) => state.storeSlice.textMessagesRefetchCounter);

  const story = route.params;

  const fetchTextMessages = () => {
    fetch(buildUrl(`/userStoryTextMessages?userToken=${userToken}&storyId=${story._id}`))
      .then((res) => res.json())
      .then(({data}) => data)
      .then((userStoryTextMessages) => {
        // generating:
        // {
        //   "773-555-1234": [message1, message2, etc.],
        //   "Bestie": [message3, message4, etc.]
        // }

        const [parsedConversations, totalAvailableMessages] = generateAvailableConversations(userStoryTextMessages, story);

        // console.log('parsedConversations', parsedConversations)

        setUnreadTextMessages(totalAvailableMessages);

        dispatch(setTextMessages(parsedConversations));
      })
  }

  useEffect(() => {
    fetchTextMessages();
  }, [textMessagesRefetchCounter]);  

  useInterval(() => {
    fetchTextMessages();
  }, 5000)

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
          params: story
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

  return (
    <StoryFrame
      navigation={navigation}
      route={route}
    >
      <ImageBackground
        style={style.backgroundImage}
        source={{ uri: story.picture }}
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

        // const unseenMessages = userStoryTextMessages.filter((m) => !m.seenByUser);
        // const numberOfNotifications = unseenMessages.length;

        // if (numberOfNotifications > 0) {

        //   // what to do when there are multiple messages?
        //   const { notificationSent, whoFrom, whoTo, message, _id } = unseenMessages[unseenMessages.length - 1]; 
        //   const contactName = whoFrom === story.mainCharacter ? whoTo : whoFrom;

        //   if (!notificationSent) {

        //     // figure out why it's appearing multiple times
        //     // schedulePushNotification(contactName, message, { contactName, story });

        //     fetch(buildUrl('/userStoryTextMessages'), {
        //       method: 'PUT',
        //       body: JSON.stringify({
        //         storyId: story._id,
        //         conversationIds: [_id],
        //         userToken: '1234',
        //         notificationSent: true,
        //       }),
        //       headers: {
        //         'Content-Type': 'application/json',
        //       },
        //     })
        //   }
        // } 

        // if (totalAvailableMessages > 0) {

          // // what to do when there are multiple messages?
          // const { notificationSent, whoFrom, whoTo, message, _id } = unseenMessages[unseenMessages.length - 1]; 
          // const contactName = whoFrom === story.mainCharacter ? whoTo : whoFrom;

          // if (!notificationSent) {

          //   // figure out why it's appearing multiple times
          //   // schedulePushNotification(contactName, message, { contactName, story });

          //   fetch(buildUrl('/userStoryTextMessages'), {
          //     method: 'PUT',
          //     body: JSON.stringify({
          //       storyId: story._id,
          //       conversationIds: [_id],
          //       userToken: '1234',
          //       notificationSent: true,
          //     }),
          //     headers: {
          //       'Content-Type': 'application/json',
          //     },
          //   })
          // }

        // } 

        // const parsedConversations = userStoryTextMessages.reduce((acc, message, index, array) => {
        //   const contactName = message.whoFrom === story.mainCharacter ? message.whoTo : message.whoFrom;

        //   if (!acc[contactName]) {
        //     acc[contactName] = [];
        //   }

        //   acc[contactName].push(message);
        //   return acc;
        // }, {})
