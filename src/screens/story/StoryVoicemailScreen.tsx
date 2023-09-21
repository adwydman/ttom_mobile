import { useState, useEffect } from 'react';
import { HeaderBackButton } from '@react-navigation/elements'
import { View, TouchableOpacity, Dimensions, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import StoryFrame from './StoryFrame';
import { IScreenProps } from '../../shared/apitypes';
import Text from 'components/Text'
import { H3 } from 'components/Headers'
import { ChevronRight, Contact, NewMessage, Pause, Play } from 'components/svgs';
import { style } from './StoryTextMessagesScreen.style';
import CatSteps from 'components/CatSteps';
import { colors } from '../../colors';

const MAX_MESSAGE_LENGTH = 75

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    flexDirection: 'row',
    borderBottomColor: colors.grey,
    borderBottomWidth: 1
  },
  wrapperShort: {
    height: 80,
  },
  wrapperLong: {
    height: 108
  },
  listItem: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 24,
    // width: '100%'
  },
  firstRow: {
    top: 12
  },
  secondRow: {
    top: 40
  },
  thirdRow: {
    top: 72
  },
  title: {
    fontSize: 20
  },
  subtext: {
    fontSize: 16,
    fontFamily: 'NiveauGroteskLight'
  },
  playMessageText: {
    fontSize: 16,
    color: colors.blue,
    flex: 1,
    marginTop: 2,
    marginLeft: 4
  },
  pause: {
    marginTop: 2
  }
})

interface IVoicemailItemProps {
  voicemail: any;
  currentlyPlayingMessageId: any;
  setCurrentlyPlayingMessageId: any;
}

const WIDTH_OFFSET = 36;
const WINDOW_WIDTH = Dimensions.get('window').width;
const ROW_WIDTH = WINDOW_WIDTH - WIDTH_OFFSET;

function VoicemailItem({voicemail, currentlyPlayingMessageId, setCurrentlyPlayingMessageId}: IVoicemailItemProps) {
  const { id, contactName, contactSecondaryMessage, timestamp, duration } = voicemail;
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [playVoicemail, setPlayVoicemail] = useState(false);

  let wrapperStyle = { ...styles.wrapper };

  if (showPlayButton) {
    wrapperStyle = {
      ...wrapperStyle,
      ...styles.wrapperLong
    };
  } else {
    wrapperStyle = {
      ...wrapperStyle,
      ...styles.wrapperShort
    }
  }

  useEffect(() => {
    if (currentlyPlayingMessageId && currentlyPlayingMessageId !== id) {
      setPlayVoicemail(false);
    }
  }, [currentlyPlayingMessageId])

  return (
    <Pressable style={wrapperStyle} onPress={() => { setShowPlayButton(!showPlayButton) }}>
      <View style={styles.listItem}>
        <View style={{...styles.row, ...styles.firstRow, width: ROW_WIDTH}}>
          <H3 style={styles.title}>{contactName}</H3>
          <Text style={styles.subtext}>{timestamp}</Text>
        </View>
        <View style={{...styles.row, ...styles.secondRow, width: ROW_WIDTH}}>
          <Text style={styles.subtext}>{contactSecondaryMessage}</Text>
          <Text style={styles.subtext}>{duration}</Text>
        </View>
        {
          showPlayButton && (
            <Pressable
              style={{...styles.row, ...styles.thirdRow }}
              onPress={() => { 
                setPlayVoicemail(!playVoicemail)
                setCurrentlyPlayingMessageId(id);
              }}
            >
              { playVoicemail && <Pause width={24} height={24} style={styles.pause} /> }
              { !playVoicemail && <Play width={24} height={24} /> }
              <Text style={styles.playMessageText}>
                { playVoicemail ? 'Pause' : 'Play' } message
              </Text>
            </Pressable>
          )
        }
      </View>
    </Pressable>
  )
}

const data = [
  {
    id: 1,
    contactName: '+1 (555) 444-3333',
    contactSecondaryMessage: 'Chicago, IL',
    timestamp: '3:31 AM',
    duration: '0:42',
  },
  {
    id: 2,
    contactName: 'Ed Johnson',
    contactSecondaryMessage: 'mobile',
    timestamp: '12:52 PM',
    duration: '4:20',
  },
]

export default function StoryTextMessagesScreen({ navigation, route }: IScreenProps) {
  const [currentlyPlayingMessageId, setCurrentlyPlayingMessageId] = useState(null);
  const textMessages = useSelector((state: any) => state.storeSlice.textMessages);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton
        onPress={() => navigation.goBack()}
      />
    });
  },
    [navigation]
  );

  return (
    <StoryFrame navigation={navigation} route={route}>

      {
        data.map((voicemail) => <VoicemailItem 
          key={voicemail.contactName}
          voicemail={voicemail}
          currentlyPlayingMessageId={currentlyPlayingMessageId}
          setCurrentlyPlayingMessageId={setCurrentlyPlayingMessageId}
        />)
      }

      {/* <Pressable style={styles.wrapper} onPress={() => {}}>
        <View style={styles.listItem}>
          <View style={styles.row}>
            <H3 style={styles.title}>+1 (555) 444-3333</H3>
            <Text style={styles.subtext}>3:31 AM</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subtext}>Chicago, IL</Text>
            <Text style={styles.subtext}>00:42</Text>
          </View>
        </View>

      </Pressable> */}

              {/* <View style={style.messagePreviewContainer}>
          <View style={style.messagePreviewWrapper}>
            <H3 style={style.contactName}>{'Test'}</H3>
            <View style={style.messagePreview}>
              <Text style={style.timestamp}>now</Text>
            </View>
          </View>
          <Text style={style.trimmedMessage}>{'Message'}</Text>
        </View> */}


      {/* <View style={styles.listItemWrapper} onPress={() => {}}>
        <View style={style.messagePreviewContainer}>
          <View style={style.messagePreviewWrapper}>
            <H3 style={style.contactName}>{'Test'}</H3>
            <View style={style.messagePreview}>
              <Text style={style.timestamp}>now</Text>
            </View>
          </View>
          <Text style={style.trimmedMessage}>{'Message'}</Text>
        </View>
      </View> */}

      {/* {
        Object.keys(textMessages).map((contactName) => {

          //todo: order by the most recent message
          const conversation = textMessages[contactName];

          const { message } = conversation[conversation.length - 1];
          const hasUnreadMessages = conversation.find((m) => !m.seenByUser);
          
          return (
            <Conversation
              key={message}
              lastMessage={message}
              contactName={contactName}
              hasUnreadMessages={hasUnreadMessages}
              onPress={() => {
                navigation.navigate('StoryConversation', {
                  screenTitle: contactName,
                })
              }}
            />
          )
        })
      } */}
    </StoryFrame>
  )
}
