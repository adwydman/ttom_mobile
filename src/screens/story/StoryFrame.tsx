import { View } from 'react-native';
import { IScreenProps } from 'shared/apitypes';
import { Home, Logo } from 'components/svgs'
import { style } from './StoryFrame.style';

interface IProps extends IScreenProps {
  children: any;
  footerStyle: any;
}
 
export default function StoryFrame({ navigation, route, children, footerStyle = {} }: IProps) {

  return (
    <>
      <View style={{ flex: 1, ...footerStyle }}>
        { children }
      </View>
      <View style={style.footer}>
        <Home width={24} height={24} onPress={() => {
          navigation.navigate({
            name: 'StoryHome',
            params: story
          })
        }}/>
        <Logo width={24} height={24} onPress={() => {
          navigation.navigate('Home')
        }}/>
      </View>
    </>
  )
}
