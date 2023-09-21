import { useState, useEffect } from 'react';
import { HeaderBackButton } from '@react-navigation/elements'
import { View, TouchableOpacity, Dimensions, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import StoryFrame from './StoryFrame';
import { IScreenProps } from '../../shared/apitypes';
import Text from 'components/Text'
import { H2, H3 } from 'components/Headers'
import { ChevronRight, Contact, NewMessage, Pause, Play } from 'components/svgs';
import { style } from './StoryTextMessagesScreen.style';
import CatSteps from 'components/CatSteps';
import { colors } from '../../colors';

const MAX_MESSAGE_LENGTH = 40;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    flexDirection: 'row',
  },
  header: {
    position: 'absolute',
  },
  listItem: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 80,
  },
  contactIcon: {
    position: 'absolute',
    marginTop: 36,
    left: 28
  },
  firstRow: {
    top: 12
  },
  rowContainer: {
    flexDirection: 'row'
  },
  fromToLabel: {
    color: colors.grey2,
    fontSize: 16,
    width: 48
  },
  contactName: {
    fontSize: 16
  },
  timestamp: {
    color: colors.grey2
  },
  secondRow: {
    top: 44
  },
  content: {
    paddingLeft: 16,
    paddingRight: 16,
    top: 88,
  },
  title: {
    fontSize: 20,
    marginBottom: 8
  },
  messages: {
    lineHeight: 24,
    fontSize: 16,
    fontFamily: 'NiveauGroteskLight'
  }
})

interface IEmailItemProps {
  email: any;
  currentlyPlayingMessageId: any;
  setCurrentlyPlayingMessageId: any;
}

const WIDTH_OFFSET = 92;
const WINDOW_WIDTH = Dimensions.get('window').width;
const ROW_WIDTH = WINDOW_WIDTH - WIDTH_OFFSET;

export default function StoryAllEmailsScreen({ navigation, route }: IScreenProps) {
  const { params: { email } } = route;

  useEffect(() => {
    navigation.setOptions({
      title: email.title
    });
  },
    [navigation]
  );

  return (
    <StoryFrame navigation={navigation} route={route}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.contactIcon}>
            <Contact width={28} height={32} />
          </View>
          <View>
            <View style={{...styles.row, ...styles.firstRow, width: ROW_WIDTH}}>
              <View style={styles.rowContainer}>
                <Text style={styles.fromToLabel}>From:</Text>
                <Text style={styles.contactName}>{email.contactName}</Text>
              </View>
              <Text style={style.timestamp}>{email.timestamp}</Text>
            </View>
            <View style={{...styles.row, ...styles.secondRow, width: ROW_WIDTH}}>
              <View style={styles.rowContainer}>
                <Text style={styles.fromToLabel}>To:</Text>
                <Text style={styles.contactName}>Me</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{email.title}</Text>
          <Text style={styles.messages}>{email.message}</Text>
        </View>
      </View>
    </StoryFrame>
  )
}
