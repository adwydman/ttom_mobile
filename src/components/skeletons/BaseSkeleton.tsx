import { StyleSheet } from 'react-native';
import { Skeleton } from '@rneui/themed';
import SkeletonGradient from "./SkeletonGradient"
import { colors } from '../../colors';

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.darkerSky,
  }
})

interface IProps {
  height: number;
  width?: number
}

export default function BaseSkeleton({ width, height }: IProps) {

  const restProps = {} as any;
  if (width) {
    restProps.width = width;
  }

  return (
    <Skeleton
      animation="wave"
      height={height}
      style={styles.skeleton}
      LinearGradientComponent={SkeletonGradient}
      {...restProps}
    />
  )
}
