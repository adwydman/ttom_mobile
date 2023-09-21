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

const MAX_MESSAGE_LENGTH = 40;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    flexDirection: 'row',
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
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
  secondRow: {
    top: 44
  },
  thirdRow: {
    top: 72
  },
  contactName: {
    fontSize: 20
  },
  subtext: {
    fontSize: 16,
    fontFamily: 'NiveauGroteskLight'
  },
  title: {
    fontSize: 16,
    fontFamily: 'NiveauGroteskMedium'
  },
  message: {
    fontSize: 16,
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

interface IEmailItemProps {
  email: any;
  onPress: any;
}

const WIDTH_OFFSET = 92;
const WINDOW_WIDTH = Dimensions.get('window').width;
const ROW_WIDTH = WINDOW_WIDTH - WIDTH_OFFSET;

function EmailItem({email, onPress}: IEmailItemProps) {
  const { id, contactName, title, timestamp, message } = email;

  const trimmedMessage = message.length > MAX_MESSAGE_LENGTH ? `${message.slice(0, MAX_MESSAGE_LENGTH)}...` : message;

  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      <View style={styles.contactIcon}>
        <Contact width={28} height={32} />
      </View>
      <View style={styles.listItem}>
        <View style={{...styles.row, ...styles.firstRow, width: ROW_WIDTH}}>
          <H3 style={styles.contactName}>{contactName}</H3>
          <Text style={styles.subtext}>{timestamp}</Text>
        </View>
        <View style={{...styles.row, ...styles.secondRow, width: ROW_WIDTH}}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={{...styles.row, ...styles.thirdRow, width: ROW_WIDTH}}>
          <Text style={styles.message}>{trimmedMessage}</Text>
        </View>
      </View>
    </Pressable>
  )
}

const data = [
  {
    id: 1,
    contactName: 'Ed Johnson',
    title: 'Want to explain',
    message: 'Hey, I wanted to talk about this thing. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    timestamp: '3:31 AM',
  },
  {
    id: 2,
    contactName: 'Ed Johnson',
    title: 'Want to explain',
    message: 'Hey, I wanted to talk about this thing. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    timestamp: '3:31 AM',
  },
]

export default function StoryAllEmailsScreen({ navigation, route }: IScreenProps) {
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
        data.map((email) => <EmailItem 
          key={email.contactName}
          email={email}
          onPress={() => {
            navigation.navigate('StoryIndividualEmail', {
              email: email
            });
          }}
        />)
      }
    </StoryFrame>
  )
}
