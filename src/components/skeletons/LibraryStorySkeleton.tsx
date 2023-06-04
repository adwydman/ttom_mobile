import { Dimensions, StyleSheet } from 'react-native';
import { Skeleton } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import Container from 'components/Container';
import StoryCard from 'components/StoryCard';
import { colors } from '../../colors';

const SMALL_LOADER_HEIGHT = 32;

const styles = StyleSheet.create({
  smallSkeletonWrapper: {
    marginTop: 16,
  },
  skeleton: {
    backgroundColor: colors.darkerSky,
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
}

export default function LibraryStorySkeleton(props) {
  const { count = 1 } = props;

  const windowWidth = Dimensions.get('window').width;

  return (
    <>
      {
        [...Array(count)].map((_, i) => {
          return (
            <StoryCard key={`skeleton_card_${i}`}>
              <Skeleton
                animation="wave"
                height={windowWidth}
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
                  width={windowWidth / 2}
                />
              </Container>
              <Container
                style={styles.smallSkeletonWrapper}
              >
                <Skeleton
                  animation="wave"
                  LinearGradientComponent={CustomGradient}
                  style={styles.skeleton}
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
