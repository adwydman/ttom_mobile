import { useState } from 'react';
import { View, TextInput, Pressable, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import Button from 'components/Button';
import Text from 'components/Text';
import Container from 'components/Container';
import { sendRequest } from 'utils/index';
import { setUser, setUserToken } from '../stores';
import { colors } from '../colors'

interface IProps {
  mode: 'login' | 'register';
  navigation: any;
}

export default function CredentialsScreen({ mode, navigation }: IProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const credentialInputStyle = {
    fontSize: 16,
    height: 40,
    borderColor: colors.black,
    borderWidth: 1,
    paddingLeft: 4,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  }

  const emailInputStyle = {
    ...credentialInputStyle
  };

  const passwordInputStyle = {
    ...credentialInputStyle
  }

  if (emailError) {
    emailInputStyle.borderColor = colors.errorRed;
  }

  if (passwordError) {
    passwordInputStyle.borderColor = colors.errorRed;
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
    const [result, fetchResult] = await sendRequest(`/${requestType}`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if ([200, 201].includes(fetchResult.status)) {
      onSuccessfulRequest(result);
    } else {
      console.log('fetchResult', fetchResult.status)
      if (requestType === 'login') {
        Alert.alert(
          'Incorrect Password',
          'The password you entered is incorrect. Please try again.',
          [ { text: 'OK' } ]  
        );
      } else if (requestType === 'register') {
        Alert.alert(
          'User Already Exists',
          'The email address you entered is associated with an existing account. Please try again.',
          [ { text: 'OK' } ]
        )
      }
    }
  }

  const validateEmail = () => {
    if (!email.length) {
      return 'Email required.'
    } 
    // uncomment when testing is finished. OR set a feature flag?
    // else if (mode === 'register' && !email.match(/^\S+@\S+\.\S+$/)) {
    //   return 'Enter a valid email address.'
    // }

    return '';
  }

  const valdiatePassword = () => {
    if (!password.length) {
      return 'Password cannot be empty.'
    } 
    // uncomment when testing is finished. OR set a feature flag?
    // else if (mode === 'register' && !password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
    //   return 'This password is too short. Create a longer password with at least 8 letters and numbers.'
    // }

    return '';
  }

  const onButtonPress = async () => {
    const emailError = validateEmail();
    const passwordError = valdiatePassword();

    setEmailError(emailError)
    setPasswordError(passwordError)

    if (!emailError.length && !passwordError.length) {
      setLoading(true);
      await sendRequst(mode);
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
  }

  const goToLogin = () => {
    resetForm();
    navigation.navigate('Login');
  }

  const goToRegister = () => {
    resetForm();
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

  const buttonText = mode === 'login' ? 'Log in' : 'Sign up';
  
  return (
    <Container style={{height: '100%', marginTop: 20}}>
      <View style={{ position: 'relative',  marginBottom: 20}}>
        <TextInput
          style={{...emailInputStyle}}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {
          emailError && <Text style={{ color: colors.errorRed, position: 'absolute', top: 40 }}>{emailError}</Text>
        }
      </View>
      <View style={{ position: 'relative', marginBottom: 44}}>
        <TextInput
          style={{...passwordInputStyle}}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {
          passwordError && <Text style={{ color: colors.errorRed, position: 'absolute', top: 40}}>{passwordError}</Text>
        }
      </View>
      <Button
        onPress={onButtonPress}
        loading={loading}
      >
        {buttonText}
      </Button>
      <View style={{ position: 'absolute', bottom: 40, width: '100%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {footer}
        </View>
      </View>
    </Container>
  )
}
