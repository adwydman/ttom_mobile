import { View } from 'react-native';
import { IScreenProps } from 'shared/apitypes';
import { Home, Logo } from 'components/svgs'
import { style } from './StoryFrame.style';

interface IProps extends IScreenProps {
  children: any;
  footerStyle?: any;
  onBothPress?: any;
}
 
export default function StoryFrame({ navigation, route, children, footerStyle = {}, onBothPress = () => {} }: IProps) {
  // todo: when storyhome button is clicked, the messages refetch needs to be triggered
  const iconSize = 24;
  return (
    <>
      <View style={{ flex: 1, ...footerStyle }}>
        { children }
      </View>
      <View style={style.footer}>
        <Home width={iconSize} height={iconSize} onPress={async () => {
          await onBothPress();
          navigation.navigate('StoryHome');
        }}/>
        <Logo width={iconSize} height={iconSize} onPress={async () => {
          await onBothPress();
          navigation.navigate('Home')
        }}/>
      </View>
    </>
  )
}
