import { View, StyleSheet } from 'react-native';
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
    <>
      <View style={styles.wrapper}>
        <SplashWave1 style={styles.wave1}/>
        <SplashWave2 style={styles.wave2}/>
        <View style={styles.textContainer}>
          <TtomLogo />
          <Text style={styles.ttomText}>ttom</Text>
          <Text style={styles.description}>a chat fiction app for grown-ups</Text>
        </View>
      </View>
      <Container>
        <View style={styles.buttonsContainer}>
          <View style={styles.loginButton}>
            <Button onPress={onLoginPress} type={'empty'}>Log in</Button>
          </View>
          <Button onPress={onSignUpPress}>Sign up</Button>
        </View>
      </Container>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
    position: 'relative',
  },
  wave1: {
    position: 'absolute',
    top: '5%'
  },
  wave2: {
    position: 'absolute',
    top: '15%'
  },
  textContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  ttomText: {
    fontSize: 96,
    color: colors.blue,
    fontFamily: 'BelyDisplay',
  },
  description: {
    fontSize: 24,
    color: colors.blue,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0
  },
  loginButton: {
    marginBottom: 8
  }
});
