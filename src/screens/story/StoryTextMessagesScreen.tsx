import { useEffect } from 'react';
import { HeaderBackButton } from '@react-navigation/elements'
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import StoryFrame from './StoryFrame';
import { IScreenProps } from '../../shared/apitypes';
import Text from 'components/Text'
import { H3 } from 'components/Headers'
import { ChevronRight, Contact, NewMessage } from 'components/svgs';
import { style } from './StoryTextMessagesScreen.style';
import CatSteps from 'components/CatSteps';

const MAX_MESSAGE_LENGTH = 75

interface IMessageProps {
  lastMessage: string;
  contactName: string;
  onPress: any;
  hasUnreadMessages: boolean;
}

function Conversation({ lastMessage = '', contactName, onPress, hasUnreadMessages }: IMessageProps) {
  const windowWidth = Dimensions.get('window').width;
  const trimmedMessage = lastMessage.length > MAX_MESSAGE_LENGTH ? `${lastMessage.slice(0, MAX_MESSAGE_LENGTH)}...` : lastMessage;

  return (
    <TouchableOpacity style={style.messageWrapper} onPress={onPress}>
      {
        hasUnreadMessages &&
        <CatSteps catStepsStyle={{ left: (windowWidth/2 + 20), bottom: 60 }} style={{ transform: [ { rotate: '25deg'} ] }} />
      }
      {
        hasUnreadMessages &&
        <NewMessage style={style.newMessageIcon}/>
      }
      <View style={style.contactIcon}>
        <Contact width={28} height={32} />
      </View>
      <View style={style.messagePreviewContainer}>
        <View style={style.messagePreviewWrapper}>
          <H3 style={style.contactName}>{contactName}</H3>
          <View style={style.messagePreview}>
            <Text style={style.timestamp}>now</Text>
            <ChevronRight style={style.chevron} />
          </View>
        </View>
        <Text style={style.trimmedMessage}>{trimmedMessage}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function StoryTextMessagesScreen({ navigation, route }: IScreenProps) {
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
      }
    </StoryFrame>
  )
}
