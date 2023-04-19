import { ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Container from 'components/Container';
import Text from 'components/Text';
import { style } from './StoryImage.style';

interface IProps {
  story: any;
  panelWidth: number;
  storyTitleStyle?: any;
  storyAuthorStyle?: any;
  style?: any
}

export default function StoryImage({ story, style : propsStyle, panelWidth, storyTitleStyle = {}, storyAuthorStyle = {} }: IProps) {
  return (
    <ImageBackground
      style={{ ...style.storyImageCover, ...propsStyle}}
      source={{uri: story.picture}}
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.5)', 'transparent']}
        style={{ ...style.gradient, height: panelWidth }}
      />
      <Container style={style.titleWrapper}>
        <Text style={{ ...style.storyTitle, ...storyTitleStyle }}>{story.name}</Text>
        <Text style={{...style.storyAuthor, ...storyAuthorStyle }}>by {story.author}</Text>
      </Container>
    </ImageBackground>
  )
}
