import { Dimensions, StyleSheet } from 'react-native';
import Container from 'components/Container';
import StoryCard from 'components/StoryCard';
import BaseSkeleton from './BaseSkeleton';

const SMALL_LOADER_HEIGHT = 32;

const styles = StyleSheet.create({
  smallSkeletonWrapper: {
    marginTop: 16,
  },
})

interface IProps {
  count?: number;
}

export default function LibraryStorySkeleton(props: IProps) {
  const { count = 1 } = props;

  const windowWidth = Dimensions.get('window').width;

  return (
    <>
      {
        [...Array(count)].map((_, i) => {
          return (
            <StoryCard key={`skeleton_card_${i}`}>
              <BaseSkeleton
                height={windowWidth}
              />
              <Container style={styles.smallSkeletonWrapper}>
                <BaseSkeleton
                  width={windowWidth / 2}
                  height={SMALL_LOADER_HEIGHT}
                />
              </Container>
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
