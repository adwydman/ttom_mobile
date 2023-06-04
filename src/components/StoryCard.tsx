import { Pressable, StyleSheet } from 'react-native';
import StoryContainer from 'components/StoryContainer';

const styles = StyleSheet.create({
  storyCardWrapper: {
    shadowOffset: {width: -2, height: 4},  
    shadowColor: 'black',  
    shadowOpacity: 0.2,  
    shadowRadius: 3,  
  }
})

interface IProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}

export default function StoryCard(props: IProps) {
  const { children, style = {}, onPress = () => {} } = props;

  return (
    <Pressable onPress={onPress}>
      <StoryContainer style={{...styles.storyCardWrapper, ...style }}>
        {children}
      </StoryContainer>
    </Pressable>
  );
}
