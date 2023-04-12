import { View, Pressable, Image } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IOScrollView, InView } from 'react-native-intersection-observer'
import { HeaderBackButton } from '@react-navigation/elements'
import { cloneDeep } from 'lodash';

import StoryFrame from './StoryFrame';
import { IScreenProps } from 'shared/apitypes';
import Text from 'components/Text'
import { BubbleTail } from 'components/svgs';
import { colors } from '../../colors';
import { style } from './StoryConversationScreen.style';
import { setRawMessages } from '../../stores';
import {
  sendRequest,
  isMainCharacter,
  getMessageTimestamp,
  getShouldDisplayCenteredTimestamp,
  isImage
} from 'utils/index';


export function useTimeout(callback, delay) {
  const timeoutRef = useRef(null);
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === 'number') {
      timeoutRef.current = window.setTimeout(tick, delay);
      return () => window.clearTimeout(timeoutRef.current);
    }
  }, [delay]);
  return timeoutRef;
};

let timeout = null;

interface IMessageProps {
  type: 'left' | 'right';
  children: string;
  timestamp?: any;
  extraStyles?: any;
  shouldShowTail: boolean;
}

function Message({ type, children, timestamp, extraStyles = {}, shouldShowTail }: IMessageProps) {
  const tailFill = type === 'left' ? colors.white : colors.blue
  const [showTimestamp, setShowTimestamp] = useState(false);

  return (
    <Pressable
      style={{ position: 'relative' }}
      onPress={() => {
        setShowTimestamp(!showTimestamp);
      }}
    >
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
  const scrollViewRef = useRef(null);
  const firstUnreadMessage = useRef(false);
  const [seenMessages, setSeenMessages] = useState(new Set());
  const textMessages = useSelector((state: any) => state.storeSlice.textMessages);
  const rawMessages = useSelector((state: any) => state.storeSlice.rawMessages);
  const userToken = useSelector((state: any) => state.storeSlice.userToken);
  const currentStory = useSelector((state: any) => state.storeSlice.currentStory);
  const conversation = textMessages[screenTitle];

  const optimisticallyUpdateMessages = async () => {
    const newRawMessages = rawMessages.map((message) => {
      let parsedMessage = message;
      if (seenMessages.has(message._id)) {
        parsedMessage = cloneDeep(message);
        parsedMessage.seenByUser = true;
      }

      return parsedMessage;
    })

    dispatch(setRawMessages(newRawMessages));

    // test failure

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
  }

  let lastType: string|null = null;

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

  const unseenMessages = [];
  const parsedMessages = [];
  // let firstUnreadMessage = false;
  let firstUnreadMessage2 = null;

  for (let i = 0; i < conversation.length; i++) {
    const { _id, message, whoFrom, enabledAt, seenByUser } = conversation[i];
    const type = isMainCharacter(whoFrom) ? 'right' : 'left';

    if (!seenMessages.has(_id)) {
      unseenMessages.push(conversation[i]);
    }

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
      console.log('message', message)
      setSeenMessages(new Set([...Array.from(seenMessages), conversation[i]._id])) 
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
        >
          {message}
        </Message>
      </InView>
    );
  }

  return (
    <StoryFrame navigation={navigation} onBothPress={optimisticallyUpdateMessages}>
      <IOScrollView
        ref={scrollViewRef}
        onLayout={() => {
          if (firstUnreadMessage.current === false && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: 0, y: 999999, animated: false})
          }
        }}
      >
        { parsedMessages }
      </IOScrollView>
    </StoryFrame>
  )
}
