import { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import Button from 'components/Button';
import Text from 'components/Text';
import Container from 'components/Container';
import { buildUrl } from 'utils/index';
import { setUser, setUserToken } from '../stores';
import { colors } from '../colors'

interface IProps {
  mode: 'login' | 'register';
  navigation: any;
}

export default function CredentialsScreen({ mode, navigation }: IProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const credentialInputStyle = {
    fontSize: 16,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: 4,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  }

  const onSuccessfulRequest = async (result: any) => {
    if (result.user) {
      dispatch(setUser(result.user));
      dispatch(setUserToken(result.user.token));
      // sets the token, which then "redirects" the screen to home
      await SecureStore.setItemAsync('userToken', result.user.token)
    }
  }

  const sendRequst = async (requestType) => {
    const fetchResult = await fetch(buildUrl(`/${requestType}`), {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await fetchResult.json();
    onSuccessfulRequest(result);
  }

  const onButtonPress = async () => {
    setLoading(true);

    await sendRequst(mode);

    setLoading(false)
  }

  const buttonText = mode === 'login' ? 'Log in' : 'Sign up';

  const goToLogin = () => {
    navigation.navigate('Login');
  }

  const goToRegister = () => {
    navigation.navigate('Register');
  }

  const footer = mode === 'login' ?
    <>
      <Text>Don't have an account? </Text>
      <Pressable onPress={goToRegister}><Text style={{ color: colors.blue }}>Sign up</Text></Pressable>
    </>
    :
    <>
      <Text>Already have an account? </Text>
      <Pressable onPress={goToLogin}><Text style={{ color: colors.blue }}>Log in</Text></Pressable>
    </>

  return (
    <Container style={{height: '100%', marginTop: 20}}>
      <TextInput
        style={{...credentialInputStyle, marginBottom: 20}}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={{...credentialInputStyle, marginBottom: 40}}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={onButtonPress} loading={loading}>{buttonText}</Button>
      <View style={{ position: 'absolute', bottom: 40, width: '100%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {footer}
        </View>
      </View>
    </Container>
  )
}
