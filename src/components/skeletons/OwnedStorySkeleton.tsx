import { Dimensions, StyleSheet } from 'react-native';
import { Skeleton } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import Container from 'components/Container';
import StoryCard from 'components/StoryCard';
import { colors } from '../../colors';

const SMALL_LOADER_HEIGHT = 24;

const styles = StyleSheet.create({
  smallSkeletonWrapper: {
    marginTop: 16,
  },
  skeleton: {
    backgroundColor: colors.darkerSky,
  },
  storyCard: {
    marginRight: 12,
    marginLeft: 12
  },
  firstStoryCard: {
    marginLeft: 0
  },
  lastStoryCard: {
    marginRight: 0
  }
})

const CustomGradient = (props) => {
  return (
    <LinearGradient 
      {...props} 
      colors={[colors.darkerSky, colors.gradientWhite, colors.darkerSky]}
    />
  );
}

interface IProps {
  count?: number;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function LibraryStorySkeleton(props: IProps) {
  const { count = 1, isFirst, isLast } = props;

  const windowWidth = Dimensions.get('window').width;
  const panelWidth = windowWidth / 2.5;

  const firstStoryCard = isFirst ? styles.firstStoryCard : {};
  const lastStoryCard = isLast ? styles.lastStoryCard : {};

  return (
    <>
      {
        [...Array(count)].map((_, i) => {
          return (
            <StoryCard
              key={`owned_story_skeleton_${i}`}
              style={{ ...styles.storyCard, ...firstStoryCard, ...lastStoryCard, width: panelWidth }}
            >
              <Skeleton
                animation="wave"
                height={panelWidth}
                style={styles.skeleton}
                LinearGradientComponent={CustomGradient}
              />
              <Container
                style={styles.smallSkeletonWrapper}
              >
                <Skeleton
                  animation="wave"
                  LinearGradientComponent={CustomGradient}
                  height={SMALL_LOADER_HEIGHT}
                  style={styles.skeleton}
                />
              </Container>
            </StoryCard>
          )
        })
      }
    </>
  )
}
