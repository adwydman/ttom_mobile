import { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Alert, Image, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Button from 'components/Button';
import Text from 'components/Text';
import Container from 'components/Container';
import { sendRequest } from 'utils/index';
import { setUser, setUserToken } from '../stores';
import { colors } from '../colors'
import { FacebookLogo } from 'components/svgs';

WebBrowser.maybeCompleteAuthSession();

type CredentialsMode = 'login' | 'register';

interface IProps {
  mode: CredentialsMode,
  navigation: any;
}

export default function CredentialsScreen({ mode, navigation }: IProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    // androidClientId: "GOOGLE_GUID.apps.googleusercontent.com",
    expoClientId: '486721598631-430nbo80v6mj4e3uc9igiafi5of83ml9.apps.googleusercontent.com',
    iosClientId: '486721598631-ooordmrt1e2so7u8r3bq3a70usap2gra.apps.googleusercontent.com',
  });
  const dispatch = useDispatch();
  
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (response?.type === "success") {
      sendRequst(mode, response.authentication.accessToken);
    }
  }, [response]);

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

  const sendRequst = async (requestType: CredentialsMode, thirdPartyToken = '') => {
    // todo: ensure HTTPS
    const [result, fetchResult] = await sendRequest(`/${requestType}`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        thirdPartyToken
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if ([200, 201].includes(fetchResult.status)) {
      onSuccessfulRequest(result);
    } else {
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
    // todo: uncomment when testing is finished. OR set a feature flag?
    // else if (mode === 'register' && !email.match(/^\S+@\S+\.\S+$/)) {
    //   return 'Enter a valid email address.'
    // }

    return '';
  }

  const validatePassword = () => {
    if (!password.length) {
      return 'Password cannot be empty.'
    } 
    // todo: uncomment when testing is finished. OR set a feature flag?
    // else if (mode === 'register' && !password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
    //   return 'This password is too short. Create a longer password with at least 8 letters and numbers.'
    // }

    return '';
  }

  const onButtonPress = async () => {
    const emailError = validateEmail();
    const passwordError = validatePassword();

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
      <View style={{ marginTop: 20, marginBottom: 34, position: 'relative' }}>
        <Text style={{ 
          position: 'absolute', 
          left: windowWidth/2 - 8 - 14, // 2*padding - fontSize
        }}>Or</Text>
      </View>
      <Button
        buttonStyle={{
          backgroundColor: colors.googleBlue,
          borderColor: colors.googleBlue,
        }}
        image={<Image style={{position: 'absolute', left: -2, height: 52}} source={require('../assets/images/google.png')} />}
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      >
        <Text style={{ color: colors.white, fontFamily: 'RobotoMedium', fontSize: 18 }}>
          Sign in with Google
        </Text>
      </Button>

      <Button
        buttonStyle={{
          backgroundColor: colors.facebookBlue,
          borderColor: colors.facebookBlue,
          marginTop: 12
        }}
        image={<FacebookLogo style={{position: 'absolute', left: 6}}/>}
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      >
        <Text style={{ color: colors.white, fontFamily: 'RobotoMedium', fontSize: 18 }}>
          Continue with Facebook
        </Text>
      </Button>
      <View style={{ position: 'absolute', bottom: 40, width: '100%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {footer}
        </View>
      </View>
    </Container>
  )
}
