import { View } from 'react-native';
import Button from 'components/Button';
import Text from 'components/Text';
import Container from 'components/Container';
import { TtomLogo, SplashWave1, SplashWave2 } from 'components/svgs';
import { colors } from '../colors'
import { IScreenProps } from '../shared/apitypes';

export default function SplashScreen({ navigation, route }: IScreenProps) {
  const onLoginPress = () => {
    navigation.navigate('Login');
  }

  const onSignUpPress = () => {
    navigation.navigate('Register');
  }

  return (
    <View style={{height: '100%', justifyContent: 'center', backgroundColor: colors.yellow, position: 'relative'}}>
      <SplashWave1 style={{ position: 'absolute', top: '5%'}}/>
      <SplashWave2 style={{ position: 'absolute', top: '15%'}}/>
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <TtomLogo />
        <Text style={{ color: colors.blue, fontSize: 96, fontFamily: 'LibreCaslonTextBold'}}>ttom</Text>
        <Text style={{ color: colors.blue, fontSize: 24 }}>a chat fiction app for grown-ups</Text>
      </View>
      <Container>
        <View style={{position: 'absolute', marginTop: '30%', width: '100%'}}>
          <View style={{marginBottom: 8}}>
            <Button onPress={onLoginPress} type={'empty'}>Log in</Button>
          </View>
          <Button onPress={onSignUpPress}>Sign up</Button>
        </View>
      </Container>
    </View>
  )
}
