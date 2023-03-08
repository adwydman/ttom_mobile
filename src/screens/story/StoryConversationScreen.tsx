import { View, Pressable } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IOScrollView, InView } from 'react-native-intersection-observer'
import { HeaderBackButton } from '@react-navigation/elements'
import { cloneDeep } from 'lodash';
import moment from 'moment';

import StoryFrame from './StoryFrame';
import { IScreenProps } from 'shared/apitypes';
import Text from 'components/Text'
import { BubbleTail } from 'components/svgs';
import { colors } from '../../colors';
import { style } from './StoryConversationScreen.style';
import { setTextMessages } from '../../stores';
import { buildUrl } from 'utils/index';


const offset = moment().utcOffset();

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

const getMessageTimestamp = (enabledAt) => {
  const messageEnabledAtLocal = moment(enabledAt).add(offset, 'minutes');  // moment(enabledAt) is UTC time
  // const currentDate = moment(new Date()).startOf('day').add(offset, 'minutes');  // Central Time
  const currentDate = moment(new Date());  // Central Time

  const diffInDays = currentDate.diff(messageEnabledAtLocal, 'days');

  let displayedDate = null;
  if (diffInDays === 1) {
    displayedDate = 'Yesterday';
  } else if (diffInDays > 1) {
    const dayName = messageEnabledAtLocal.format('dddd')

    if (diffInDays < 6) {
      displayedDate = dayName;
    } else if (diffInDays >= 6 && diffInDays <= 365) {
      displayedDate = `${dayName}, ${messageEnabledAtLocal.format('MMM')} ${messageEnabledAtLocal.format('D')}`;
    } else if (diffInDays > 365) {
      displayedDate = `${dayName}, ${messageEnabledAtLocal.format('MMM')} ${messageEnabledAtLocal.format('D')} ${messageEnabledAtLocal.format('YYYY')}`;
    }
  } 

  return `${displayedDate ? `${displayedDate} • ` : ''}${moment(enabledAt).format('h:mm a')}`;
}

const getShouldDisplayCenteredTimestamp = (i, conversation) => {
  let shouldDisplayCenteredTimestamp = false;

  if (i === 0) {
    shouldDisplayCenteredTimestamp = true;
  } else {
    const messageEnabledAtLocal = moment(conversation[i].enabledAt);  // moment(enabledAt) is UTC time
    const previousMessageEnabledAt = moment(conversation[i-1].enabledAt);

    const messageMinutesApart = messageEnabledAtLocal.diff(previousMessageEnabledAt, 'minutes');

    if (messageMinutesApart >= 30) {
      shouldDisplayCenteredTimestamp = true;
    }
  }

  return shouldDisplayCenteredTimestamp;
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
          <Text style={{...style.message, ...style[`${type}Font`]}}>{children}</Text>
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
  const { story, screenTitle } = route.params;
  const scrollViewRef = useRef(null);
  const firstUnreadMessage = useRef(false);
  const [seenMessages, setSeenMessages] = useState(new Set());
  const [canRun, setCanRun] = useState(true)
  const textMessages = useSelector((state: any) => state.storeSlice.textMessages);
  const conversation = textMessages[screenTitle];
  const textMessagesClone = cloneDeep(textMessages);

  const optimisticallyUpdateMessages = async () => {
    const seenMessagesArray = Array.from(seenMessages);
    const newMessages = conversation.map((message) => {
      const messageCopy = cloneDeep(message);
      if (seenMessagesArray.some((messageId) => messageId === message._id)) {
        messageCopy.seenByUser = true;
      }
      return messageCopy;
    });

    textMessagesClone[screenTitle] = newMessages;
    dispatch(setTextMessages(textMessagesClone));

    // test failure

    fetch(buildUrl('/userStoryTextMessages'), {
      method: 'PUT',
      body: JSON.stringify({
        storyId: story._id,
        conversationIds: Array.from(seenMessages),
        userToken: '1234',
        seenByUser: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      setTimeout(() => {
        // throw new Error();
      }, 1000)
    })
    .catch(() => {
      dispatch(setTextMessages(textMessagesClone));
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

  const areAllMessagesUnread = conversation.some(m => !m.seenByUser);

  for (let i = 0; i < conversation.length; i++) {
    const { _id, message, whoFrom, enabledAt, seenByUser } = conversation[i];
    const type = whoFrom === story.mainCharacter ? 'right' : 'left';

    if (!seenMessages.has(_id)) {
      unseenMessages.push(conversation[i]);
    }

    let shouldShowTail = true;

    if (i < conversation.length - 1) {
      const nextMessageType = conversation[i + 1].whoFrom === story.mainCharacter ? 'right' : 'left';
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
          // if (firstUnreadMessage.current === false && seenByUser === false) {
          //   firstUnreadMessage.current = true;

          //   if (scrollViewRef.current) {
          //     scrollViewRef.current.scrollTo({ x: 0, y: event.nativeEvent.layout.y, animated: false})
          //   }
          // }
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
    <StoryFrame
      navigation={navigation}
      route={route}
    >
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
