import { useState, useEffect } from 'react';
import { HeaderBackButton } from '@react-navigation/elements'
import { View, TouchableOpacity, Dimensions, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import StoryFrame from './StoryFrame';
import { IScreenProps } from '../../shared/apitypes';
import Text from 'components/Text'
import { H3 } from 'components/Headers'
import { Audio } from 'expo-av';

import { ChevronRight, Contact, NewMessage, Pause, Play } from 'components/svgs';
import { style } from './StoryTextMessagesScreen.style';
import CatSteps from 'components/CatSteps';
import { colors } from '../../colors';
import useAsyncEffect from 'utils/hooks/useAsyncEffect';

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
  },
  row2: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    left: 24
  },
  loading: {
    right: 36,
    top: 3
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
  navigation: any;
}

const WIDTH_OFFSET = 36;
const WINDOW_WIDTH = Dimensions.get('window').width;
const ROW_WIDTH = WINDOW_WIDTH - WIDTH_OFFSET;

//todo: add duration

function VoicemailItem({voicemail, currentlyPlayingMessageId, setCurrentlyPlayingMessageId, navigation}: IVoicemailItemProps) {
  const { id, contactName, contactSecondaryMessage, timestamp, duration, url } = voicemail;
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (sound) {
        setSound(null);
        sound.unloadAsync();
        setCurrentlyPlayingMessageId(null);
      }
    })

    return unsubscribe;
  }, [navigation, sound]);


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

  useAsyncEffect(async () => {
    if (currentlyPlayingMessageId === id) {
      setIsLoading(true);
      const { sound } = await Audio.Sound.createAsync({ uri: url }, undefined, (status) => {
        if (status.didJustFinish) {
          setCurrentlyPlayingMessageId(null);
        }
      });
      setSound(sound);

      await sound.playAsync();
      setIsLoading(false);
    } else {
      if (sound) {
        sound.unloadAsync();
        setSound(null);
      }
    }
  }, [currentlyPlayingMessageId]);

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
            <View style={{...styles.thirdRow }}>

              {
                currentlyPlayingMessageId === id && <>
                  <Pressable 
                    style={styles.row2}
                    onPress={async () => {
                      setCurrentlyPlayingMessageId(null);
                    }}
                  >
                    <Pause width={24} height={24} style={styles.pause} />
                    <Text style={styles.playMessageText}>Pause message</Text>
                    { isLoading && <Text style={styles.loading}>Loading...</Text> }
                  </Pressable>
                </>
              }
              {
                currentlyPlayingMessageId !== id &&
                <Pressable 
                  style={styles.row2}
                  onPress={async () => { 
                    setCurrentlyPlayingMessageId(id);
                  }}
                >
                  <Play width={24} height={24} style={styles.pause} />
                  <Text style={styles.playMessageText}>Play message</Text>
                  { isLoading && <Text style={styles.loading}>Loading...</Text> }
                </Pressable>
              }
            </View>
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
    // duration: '0:42',
    url: 'https://download.samplelib.com/mp3/sample-3s.mp3',
  },
  {
    id: 2,
    contactName: 'Ed Johnson',
    contactSecondaryMessage: 'mobile',
    timestamp: '12:52 PM',
    // duration: '4:20',
    url: 'https://file-examples.com/storage/fe7fa6fa10650d95e925ca2/2017/11/file_example_MP3_700KB.mp3',
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
          navigation={navigation}
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
