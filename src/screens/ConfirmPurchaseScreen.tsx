import { View, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { IScreenProps } from '../shared/apitypes';
import TextArea from '../components/TextArea';
import Text from '../components/Text';
import Container from '../components/Container';
import Button from '../components/Button';
import { style } from './ConfirmPurchaseScreen.style';


export default function ConfirmPurchaseScreen({ navigation, route }: IScreenProps) {
  const story = route.params;
  const windowWidth = Dimensions.get('window').width;

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end'}}>
      <TextArea style={{ marginTop: '5%' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20, marginTop: '5%', marginBottom: '5%' }}>Awesome! You're ready to start!</Text>
          <ImageBackground  
            style={{...style.imageCover, width: windowWidth / 1.2, height: windowWidth / 1.2}}
            source={{ uri: story.picture }}
          >
            <Container>
              <Text style={style.storyTitle}>{story.name}</Text>
              <Text style={style.storyAuthor}>by {story.author}</Text>
            </Container>
          </ImageBackground>
        </View>
        <Container style={{ marginTop: '5%'}}>
          <Text style={{ fontSize: 16 }}>You’ll be observing this exciting drama through Jessica’s phone. The story starts at 9:00 pm when Jessica gets a strange text from an unknown number.</Text>
        </Container>
      </TextArea>
      <Container style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 36 }}>
        <Button onPress={() => {
          navigation.navigate({
            name: 'StoryHome',
            params: story
          })
        }}>
          Start the Story
        </Button>
      </Container>
    </View>
  )
}
