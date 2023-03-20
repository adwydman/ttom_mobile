import { View, ImageBackground, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { IScreenProps } from '../shared/apitypes';
import StoryContainer from '../components/StoryContainer';
import Text from '../components/Text';
import Container from '../components/Container';
import Button from '../components/Button';
import { style } from './ConfirmPurchaseScreen.style';


export default function ConfirmPurchaseScreen({ navigation }: IScreenProps) {
  const currentStory = useSelector((state: any) => state.storeSlice.currentStory);

  const windowWidth = Dimensions.get('window').width;

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end'}}>
      <StoryContainer style={{ marginTop: '5%' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20, marginTop: '5%', marginBottom: '5%' }}>Awesome! You're ready to start!</Text>
          <ImageBackground  
            style={{...style.imageCover, width: windowWidth / 1.2, height: windowWidth / 1.2}}
            source={{ uri: currentStory.picture }}
          >
            <Container>
              <Text style={style.storyTitle}>{currentStory.name}</Text>
              <Text style={style.storyAuthor}>by {currentStory.author}</Text>
            </Container>
          </ImageBackground>
        </View>
        <Container style={{ marginTop: '5%'}}>
          <Text style={{ fontSize: 16 }}>You’ll be observing this exciting drama through Jessica’s phone. The story starts at 9:00 pm when Jessica gets a strange text from an unknown number.</Text>
        </Container>
      </StoryContainer>
      <Container style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 36 }}>
        <Button onPress={() => {
          navigation.navigate({
            name: 'StoryHome',
          })
        }}>
          Start the Story
        </Button>
      </Container>
    </View>
  )
}
