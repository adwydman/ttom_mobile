import { useState } from 'react';
import { View, TextInput, Dimensions, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import Button from 'components/Button';
import Text from 'components/Text';
import Container from 'components/Container';
import { H1 } from 'components/Headers';
import { buildUrl } from 'utils/index';
import { setUserToken } from '../stores';
import { colors } from '../colors'
import { IScreenProps } from '../shared/apitypes';


export default function LoginScreen({ navigation, route }: IScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const windowWidth = Dimensions.get('window').width;

  // 404 not working???
  const login = async () => {
    fetch(buildUrl('/login'), {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      if (result.token) {
        dispatch(setUserToken(result.token));
        console.log('result.token', result.token)
        return SecureStore.setItemAsync('userToken', result.token)
      }
    })
    .catch((error) => {
      console.log('error', error)
    })
  }

  const goToRegister = () => {
    navigation.navigate('Register');
  }

  return (
    <Container style={{height: '100%', justifyContent: 'center'}}>
      <H1>Log in</H1>
      <TextInput
        style={{fontSize: 16, height: 40, borderColor: 'black', borderWidth: 1, marginBottom: 8, paddingLeft: 12}}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={{fontSize: 16, height: 40, borderColor: 'black', borderWidth: 1, marginBottom: 40, paddingLeft: 12}}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={() => {login()}}>Log in</Button>
      <View style={{ position: 'absolute', bottom: 32, left: windowWidth/4, flexDirection: 'row' }}>
        <Text>Don't have an account? </Text>
        <Pressable onPress={goToRegister}><Text style={{ color: colors.blue }}>Sign up</Text></Pressable>
      </View>
    </Container>
  )
}
