import { Dimensions, StyleSheet } from 'react-native';
import Container from 'components/Container';
import StoryCard from 'components/StoryCard';
import BaseSkeleton from './BaseSkeleton';

const SMALL_LOADER_HEIGHT = 24;

const styles = StyleSheet.create({
  smallSkeletonWrapper: {
    marginTop: 11,
    marginBottom: -5
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
              <BaseSkeleton
                height={panelWidth}
              />
              <Container style={styles.smallSkeletonWrapper}>
                <BaseSkeleton
                  height={SMALL_LOADER_HEIGHT}
                />
              </Container>
            </StoryCard>
          )
        })
      }
    </>
  )
}
