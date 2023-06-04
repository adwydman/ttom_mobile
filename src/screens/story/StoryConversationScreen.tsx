import { StyleSheet, View, Pressable, Image } from 'react-native';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cloneDeep } from 'lodash';
import { IOScrollView, InView } from 'react-native-intersection-observer'
import { HeaderBackButton } from '@react-navigation/elements'
import StoryFrame from './StoryFrame';
import { IScreenProps } from 'shared/apitypes';
import Text from 'components/Text'
import { BubbleTail } from 'components/svgs';
import Button from 'components/Button';
import Container from 'components/Container';
import { colors } from '../../colors';
import { setRawMessages, setCurrentScreenName } from '../../stores';
import {
  isImage,
  sendRequest,
  isMainCharacter,
  getMessageTimestamp,
  getConversationStartingIndex,
  getShouldDisplayCenteredTimestamp,
} from 'utils/index';

export const styles = StyleSheet.create({
  bubble: {
    borderRadius: 6,
    padding: 8,
    maxWidth: '70%',
    marginBottom: 2
  },
  left: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    marginLeft: 16
  },
  right: {
    alignSelf: 'flex-end',
    backgroundColor: colors.blue,
    marginRight: 16
  },
  timestamp: {
    color: '#bcc1c6',
    fontSize: 10,
  },
  message: {
    fontSize: 16,
    lineHeight: 24
  },
  leftFont: {},
  rightFont: {
    color: colors.white
  },
  tail: {
    position: 'absolute',
    bottom: 4,
  },
  leftTail: {
    left: 8,
  },
  rightTail: {
    right: 8,
    transform: [ { scaleX: -1 } ]
  }
});


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
        <View style={{...styles.bubble, ...styles[type], ...extraStyles}}>
          {
            isImage(children) ?
              <Image source={{ uri: children }} style={{ width: 200, height: 200, resizeMode: 'cover',}} /> :
              <Text style={{...styles.message, ...styles[`${type}Font`]}}>{children}</Text>
          }
        </View>
        { shouldShowTail && <BubbleTail style={{...styles.tail, ...styles[`${type}Tail`]}} fill={tailFill} /> }
      </View>
      {
        showTimestamp &&
        <Text style={{ ...styles[type], backgroundColor: 'transparent', fontSize: 12, marginBottom: 8 }}>{timestamp}</Text>
      }
    </Pressable>
  )
}

export default function StoryConversationScreen({ navigation, route }: IScreenProps) {
  const dispatch = useDispatch();
  const { screenTitle } = route.params;
  const scrollViewRef = useRef(null);
  const firstUnreadMessage = useRef(false);
  const scrolledOnLoad = useRef(false);
  const [seenMessages, setSeenMessages] = useState(new Set());
  const textMessages = useSelector((state: any) => state.storeSlice.textMessages);
  const rawMessages = useSelector((state: any) => state.storeSlice.rawMessages);
  const userToken = useSelector((state: any) => state.storeSlice.userToken);
  const currentStory = useSelector((state: any) => state.storeSlice.currentStory);
  const [startingIndex, setStartingIndex] = useState(() => getConversationStartingIndex(rawMessages))
  const [oldStartingIndex, setOldStartingIndex] = useState(0);
  const conversation = textMessages[screenTitle];

  const optimisticallyUpdateMessages = useCallback(async () => {
    // const newRawMessages = rawMessages.map((message) => {
    //   let parsedMessage = message;
    //   if (seenMessages.has(message._id)) {
    //     parsedMessage = cloneDeep(message);
    //     parsedMessage.seenByUser = true;
    //   }

    //   return parsedMessage;
    // })

    // dispatch(setRawMessages(newRawMessages));

    // sendRequest('/userStoryTextMessages', {
    //   method: 'PUT',
    //   body: JSON.stringify({
    //     storyId: currentStory._id,
    //     conversationIds: Array.from(seenMessages),
    //     seenByUser: true,
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${userToken}`,
    //   },
    // })
    // .catch(() => {
    //   dispatch(setRawMessages(rawMessages));
    // })
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

  const scrollOnLoad = () => {
    if (
      firstUnreadMessage.current === false && 
      scrollViewRef.current && 
      scrolledOnLoad.current === false
    ) {
      scrollViewRef.current.scrollTo({ x: 0, y: 999999, animated: false})
    }
  }

  const parsedMessages = useMemo(() => {
    const parsedMessages = [];
    let firstUnreadMessage2 = null;
    let scrollToMessageWhenLazyLoading = null;
    const conversationLength = conversation.length;
    let nextConversationItem = null;
    let lastType: string|null = null;

    if (startingIndex !== 0) {

      //todo: make a link
      parsedMessages.push(
        <Container key={'loadMorePrevious'} style={{ marginTop: 20, marginBottom: 20 }}>
          <Button
            type={'link'}
            onPress={() => {
              if (startingIndex < 20) {
                setStartingIndex(0);
              } else {
                setStartingIndex(startingIndex - 20);
              }
              setOldStartingIndex(startingIndex)
            }}
          >
            Load more messages
          </Button>
        </Container>
      )
    }
  
    for (let i = startingIndex; i < conversationLength; i++) {
      if (i + 1 < conversationLength) {
        nextConversationItem = conversation[i + 1];
      } else {
        nextConversationItem = null;
      }

      const { _id, message, whoFrom, enabledAt, seenByUser } = conversation[i];
      const type = isMainCharacter(whoFrom) ? 'right' : 'left';
      let shouldShowTail = true;

      if (nextConversationItem) {
        const nextMessageType = isMainCharacter(nextConversationItem.whoFrom) ? 'right' : 'left';
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
        setSeenMessages(prevState => new Set(prevState).add(_id));
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

      if (oldStartingIndex !== startingIndex && i === oldStartingIndex) {
        scrollToMessageWhenLazyLoading = message;
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

      console.log('shouldShowTail', shouldShowTail)
  
      parsedMessages.push(
        <InView
          key={_id}
          onChange={onChange}
          style={wrapperStyle}
          onLayout={(event) => {
            if (message === firstUnreadMessage2) {
              if (scrollViewRef.current && scrolledOnLoad.current === false) {
                console.log('scroll to unread')
                firstUnreadMessage.current = true;
  
                let offset = 40;
                if (shouldDisplayCenteredTimestamp) {
                  offset = 80;
                }
                scrolledOnLoad.current = true
                scrollViewRef.current.scrollTo({ x: 0, y: event.nativeEvent.layout.y - offset, animated: false})
              }
            } else if (message === scrollToMessageWhenLazyLoading) {
              if (scrollViewRef.current) {
                console.log('scroll to message when lazy loading')
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

      // if (i + 1 < conversationLength) {
      //   nextConversationItem = conversation[i + 1];
      // } else {
      //   nextConversationItem = null;
      // }
    }

    return parsedMessages;
  }, [conversation, startingIndex])

  return (
    <StoryFrame navigation={navigation} onBothPress={optimisticallyUpdateMessages} route={route}>
      <IOScrollView
        ref={scrollViewRef}
        onLayout={scrollOnLoad}
      >
        { parsedMessages }
      </IOScrollView>
    </StoryFrame>
  )
}
