import { View, Pressable, Image } from 'react-native';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { IOScrollView, InView } from 'react-native-intersection-observer'
import { HeaderBackButton } from '@react-navigation/elements'
import { cloneDeep } from 'lodash';

import StoryFrame from './StoryFrame';
import { IScreenProps } from 'shared/apitypes';
import Text from 'components/Text'
import { BubbleTail } from 'components/svgs';
import { colors } from '../../colors';
import { style } from './StoryConversationScreen.style';
import { setRawMessages, setCurrentScreenName } from '../../stores';
import {
  sendRequest,
  isMainCharacter,
  getMessageTimestamp,
  getShouldDisplayCenteredTimestamp,
  isImage
} from 'utils/index';

interface IMessageProps {
  type: 'left' | 'right';
  children: string;
  timestamp?: any;
  extraStyles?: any;
  shouldShowTail: boolean;
  conversation: any;
  previousMessage: any;
}

function Message({ type, children, timestamp, extraStyles = {}, shouldShowTail, conversation, previousMessage }: IMessageProps) {
  const tailFill = type === 'left' ? colors.white : colors.blue
  const [showTimestamp, setShowTimestamp] = useState(false);

  const shouldShowNameInGroupChat = (type === 'left') && (conversation.whoTo.split(';').length > 1) && (previousMessage === undefined || previousMessage.whoFrom !== conversation.whoFrom)

  return (
    <Pressable
      style={{ position: 'relative' }}
      onPress={() => {
        setShowTimestamp(!showTimestamp);
      }}
    >
      {
        shouldShowNameInGroupChat && (
          <View style={{ marginLeft: 16, marginBottom: 2, marginTop: 8 }}>
            <Text>
              {conversation.whoFrom}
            </Text>
          </View>
        ) 
      }
      <View>
        <View style={{...style.bubble, ...style[type], ...extraStyles}}>
          {
            isImage(children) ?
              <Image source={{ uri: children }} style={{ width: 200, height: 200, resizeMode: 'cover',}} /> :
              <Text style={{...style.message, ...style[`${type}Font`]}}>{children}</Text>
          }
        </View>
        { shouldShowTail && <BubbleTail style={{...style.tail, ...style[`${type}Tail`]}} fill={tailFill} /> }
      </View>
      {
        showTimestamp &&
        <Text style={{ ...style[type], backgroundColor: 'transparent', fontSize: 12, marginBottom: 8 }}>{timestamp}</Text>
      }
    </Pressable>
  )
}

export default function StoryConversationScreen({ navigation, route }: IScreenProps) {
  const dispatch = useDispatch();
  const { screenTitle } = route.params;
  const giftedChatRef = useRef(null);
  const scrollViewRef = useRef(null);
  const firstUnreadMessage = useRef(false);
  const [seenMessages, setSeenMessages] = useState(new Set());
  const textMessages = useSelector((state: any) => state.storeSlice.textMessages);
  const rawMessages = useSelector((state: any) => state.storeSlice.rawMessages);
  const userToken = useSelector((state: any) => state.storeSlice.userToken);
  const currentStory = useSelector((state: any) => state.storeSlice.currentStory);
  const conversation = textMessages[screenTitle];
  const [isLoaded, setIsLoaded] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const optimisticallyUpdateMessages = useCallback(async () => {
    const newRawMessages = rawMessages.map((message) => {
      let parsedMessage = message;
      if (seenMessages.has(message._id)) {
        parsedMessage = cloneDeep(message);
        parsedMessage.seenByUser = true;
      }

      return parsedMessage;
    })

    dispatch(setRawMessages(newRawMessages));

    sendRequest('/userStoryTextMessages', {
      method: 'PUT',
      body: JSON.stringify({
        storyId: currentStory._id,
        conversationIds: Array.from(seenMessages),
        seenByUser: true,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
    })
    .catch(() => {
      dispatch(setRawMessages(rawMessages));
    })
  }, [dispatch, rawMessages, seenMessages, userToken, currentStory]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton
        onPress={() => {
          optimisticallyUpdateMessages();
          navigation.goBack();
        }}
      />
    });
  }, [navigation, seenMessages]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      dispatch(setCurrentScreenName(screenTitle));
    });

    return () => {
      dispatch(setCurrentScreenName(null));
      unsubscribe();
    };
  }, [navigation, screenTitle]);

  const scrollOnLoad = useCallback(() => {
    if (firstUnreadMessage.current === false && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 999999, animated: false})
    }
  }, [scrollViewRef, firstUnreadMessage]);

  const parsedMessages = useMemo(() => {
    const parsedMessages = [];
    let firstUnreadMessage2 = null;
    let lastType: string|null = null;
  
    for (let i = 0; i < conversation.length; i++) {
      const { _id, message, whoFrom, enabledAt, seenByUser } = conversation[i];
      const type = isMainCharacter(whoFrom) ? 'right' : 'left';
      let shouldShowTail = true;
  
      if (i < conversation.length - 1) {
        const nextMessageType = isMainCharacter(conversation[i + 1].whoFrom) ? 'right' : 'left';
        if (nextMessageType === type) {
          shouldShowTail = false;
        }
      }
  
      let extraStyles = {};
      if (lastType !== null && type !== lastType) {
        extraStyles = {
          marginTop: 8
        }
      }
  
      const wrapperStyle = {};
      if (i + 1 === conversation.length) {
        wrapperStyle.marginBottom = 40;
      }
  
      lastType = type;
  
      const onChange = (isVisible: boolean) => {
        setSeenMessages(new Set([...Array.from(seenMessages), _id])) 
      }
  
      const fullTimestamp = getMessageTimestamp(enabledAt);
      const shouldDisplayCenteredTimestamp = getShouldDisplayCenteredTimestamp(i, conversation);
  
      if (firstUnreadMessage2 === null && seenByUser === false) {
        firstUnreadMessage2 = message;
  
        parsedMessages.push(
          <View key={'unread'} style={{ position: 'relative', marginTop: 16, marginBottom: 16, alignItems: 'center' }}>
            <View style={{ position: 'absolute', top: 6, height: 2, width: '100%', backgroundColor: 'black', opacity: 0.1}}></View>
            <Text style={{ fontSize: 12, backgroundColor: '#f2f2f2', paddingLeft: 8, paddingRight: 8 }}>Unread</Text>
          </View>
        );
      }
  
      if (shouldDisplayCenteredTimestamp) {
        parsedMessages.push(
          <View key={`${message}-${enabledAt}`} style={{ marginTop: 12, marginBottom: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 12 }}>
              {fullTimestamp}
            </Text>
          </View>
        )
      }
  
      parsedMessages.push(
        <InView
          key={i}
          onChange={onChange}
          style={wrapperStyle}
          onLayout={(event) => {
            if (message === firstUnreadMessage2) {
              if (scrollViewRef.current) {
                firstUnreadMessage.current = true;
  
                let offset = 40;
                if (shouldDisplayCenteredTimestamp) {
                  offset = 80;
                }
  
                scrollViewRef.current.scrollTo({ x: 0, y: event.nativeEvent.layout.y - offset, animated: false})
              }
            }
          }}
        >
          <Message
            type={type}
            extraStyles={extraStyles}
            shouldShowTail={shouldShowTail}
            timestamp={fullTimestamp}
            conversation={conversation[i]}
            previousMessage={conversation[i - 1]}
          >
            {message}
          </Message>
        </InView>
      );
    }

    return parsedMessages;
  }, [conversation, seenMessages])

  // useEffect(() => {
  //   let cutOff = 0;
  //   if (isLoaded) {
  //     setTimeout(() => {
  //       const giftedMessages = [];
  //       for (let i = conversation.length - 1; i >= 0; i--) {
  //         const message = conversation[i];
      
  //         giftedMessages.push(
  //           {
  //             _id: message._id,
  //             text: message.message,
  //             createdAt: new Date(message.enabledAt),
  //             user: {
  //               _id: isMainCharacter(message.whoFrom) ? 1 : 2,
  //               name: message.whoFrom
  //             }
  //           }
  //         )
  //       }
  //       setChatMessages(giftedMessages);
  //     }, 3000)
  //   } else {
  //     const giftedMessages = [];
  //     for (let i = conversation.length - 20; i >= 0; i--) {
  //       const message = conversation[i];
    
  //       giftedMessages.push(
  //         {
  //           _id: message._id,
  //           text: message.message,
  //           createdAt: new Date(message.enabledAt),
  //           user: {
  //             _id: isMainCharacter(message.whoFrom) ? 1 : 2,
  //             name: message.whoFrom
  //           }
  //         }
  //       )
  //     }
  //     setChatMessages(giftedMessages);
  //   }

  // }, [isLoaded]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     giftedChatRef.current?._messageContainerRef?.current?.scrollToIndex({
  //       animated: true,
  //       index: 7,
  //     });
  //   })
  // }, [giftedChatRef.current?._messageContainerRef?.current])

  // const scrollToIndexFailed = (info) => {
  //   console.log('info', info)
  //   const offset = info.averageItemLength * info.index;
  //   giftedChatRef.current?._messageContainerRef?.current.scrollToOffset({ offset });
  //   setTimeout(() => {
  //     giftedChatRef.current?._messageContainerRef?.current.scrollToIndex({
  //       index: info.index,
  //       animated: true,
  //       viewPosition: 0.5,
  //     });
  //   }, 100);
  // };

  const giftedMessages = [];
  for (let i = 0; i < conversation.length; i++) {
    // for (let i = conversation.length - 1; i >= 0; i--) {
    const message = conversation[i];

    giftedMessages.push(
      {
        _id: message._id,
        text: message.message,
        createdAt: new Date(message.enabledAt),
        user: {
          _id: isMainCharacter(message.whoFrom) ? 1 : 2,
          name: message.whoFrom
        }
      }
    )
  }

  return (
    <StoryFrame navigation={navigation} onBothPress={optimisticallyUpdateMessages} route={route}>
      <View style={{ height: '100%', width: '100%'}}>
        <GiftedChat
          ref={giftedChatRef}
          messages={giftedMessages}
          renderInputToolbar={() => null}
          renderAvatar={null}
          listViewProps={{
            inverted: false,
            initialScrollIndex: 15,
            onLayout: () => {
              console.log('here')
              setIsLoaded(true);
            }
          }}
          renderBubble={props => {
            return(
            <Bubble
              {...props}
              wrapperStyle={{
                left: {
                  backgroundColor: colors.white,
                },
                right: {
                  backgroundColor: colors.blue,
                },
              }}
            />
          )}}
          user={{ _id: 1, }}
          scrollToBottom={false}
        />
      </View>
      {/* <IOScrollView
        ref={scrollViewRef}
        onLayout={scrollOnLoad}
      >
        { parsedMessages }
      </IOScrollView> */}
    </StoryFrame>
  )
}
