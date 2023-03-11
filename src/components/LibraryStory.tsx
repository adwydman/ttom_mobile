import { useState, useEffect } from 'react';
import { Platform, ImageBackground, View, Image, Dimensions, FlatList, Pressable } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import { Skeleton } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { IScreenProps } from '../shared/apitypes';
import { buildUrl } from 'utils/index';
import { style } from './LibraryStory.style';
import Text from '../components/Text';
import TextArea from 'components/TextArea';
import { H1, H3 } from 'components/Headers';
import Container from 'components/Container';
import { setCurrentStory } from 'stores/index';

interface IProps {
  story: any;
  navigation: any;
}

export default function LibraryStory({ story, navigation }: IProps) {
  const dispatch = useDispatch();
  const windowWidth = Dimensions.get('window').width;

  return (
    <Pressable key={story.name} onPress={() => {
      dispatch(setCurrentStory(story));
      navigation.navigate({
        name: 'StoryInfo',
      })
    }}>
      <TextArea>
        <View style={{ width: '100%', height: windowWidth }}>
          <ImageBackground  
            style={style.imageCover}
            source={{uri: story.picture }}
          >
            <Container>
              <Text style={style.storyTitle}>{story.name}</Text>
              <Text style={style.storyAuthor}>by {story.author}</Text>
            </Container>
          </ImageBackground>
        </View>
        <View style={style.storyDetailsWrapper}>
          <Container style={style.storyDetailsHeader}>
            <H3 style={style.storyDetailsHeaderItem}>{story.categories.join(', ')}</H3>
            <H3 style={style.storyDetailsHeaderItem}>{story.duration}</H3>
          </Container>
          <Container>
            <Text>{story.description}</Text>
          </Container>
        </View>
      </TextArea>
    </Pressable>
  )
}
