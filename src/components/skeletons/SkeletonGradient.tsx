
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../colors';

export default function SkeletonGradient(props: any) {
  return (
    <LinearGradient 
      {...props} 
      colors={[colors.darkerSky, colors.gradientWhite, colors.darkerSky]}
    />
  );
}
