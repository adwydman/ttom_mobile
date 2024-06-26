import { useState } from 'react';
import { useFonts } from 'expo-font';
import { useSelector, useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeDrawer from 'drawers/HomeDrawer';
import LoginScreen from 'screens/LoginScreen';
import SplashScreen from 'screens/SplashScreen';
import RegisterScreen from 'screens/RegisterScreen';
import StoryInfoScreen from 'screens/StoryInfoScreen';
import ConfirmPurchaseScreen from 'screens/ConfirmPurchaseScreen';
import StoryHomeScreen from 'screens/story/StoryHomeScreen';
import StoryTextMessagesScreen from 'screens/story/StoryTextMessagesScreen';
import StoryConversationScreen from 'screens/story/StoryConversationScreen';
import StoryPhotosScreen from 'screens/story/StoryPhotosScreen';
import StoryIndividualPhotoScreen from 'screens/story/StoryIndividualPhotoScreen';
import StoryVoicemailScreen from 'screens/story/StoryVoicemailScreen';
import StoryAllEmailsScreen from 'screens/story/StoryAllEmailsScreen';
import StoryIndividualEmailScreen from 'screens/story/StoryIndividualEmailScreen';
import LoadingSplash from './LoadingSplash';
import { setUser, setUserToken } from '../stores';
import useAsyncEffect from 'utils/hooks/useAsyncEffect';
import useRequest from 'utils/hooks/useRequest';

const Stack = createNativeStackNavigator();

export default function Navigator() {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const userToken = useSelector((state: any) => state.storeSlice.userToken);

  const [fontsLoaded] = useFonts({
    BelyDisplay: require('../assets/fonts/BelyDisplay.otf'),
    Niveau_smallCaps: require('../assets/fonts/Niveau_smallCaps.ttf'),
    NiveauGroteskMedium: require('../assets/fonts/NiveauGroteskMedium.ttf'),
    NiveauGroteskRegular: require('../assets/fonts/NiveauGroteskRegular.ttf'),
    NiveauGroteskLight: require('../assets/fonts/NiveauGroteskLight.ttf'),
  });

  useAsyncEffect(async () => {
    const storeUserToken = await SecureStore.getItemAsync('userToken');

    await SecureStore.deleteItemAsync('userToken');
    if (storeUserToken) {
      dispatch(setUserToken(storeUserToken))
    }

  }, []);

  useRequest({
    queryKey: ['user'], 
    url: '/users',
    refetchOnScreenFocus: true,
    onSuccess: (data: any) => {
      dispatch(setUser(data.user));
      setLoading(false);
    }
  });

  if (!fontsLoaded || loading) {
    return <LoadingSplash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {
          userToken !== null ? <>
            <Stack.Screen name="HomeDrawer" component={HomeDrawer} options={{ header: () => null }}/>
            <Stack.Screen name="StoryInfo" component={StoryInfoScreen} />
            <Stack.Screen name="ConfirmPurchase" component={ConfirmPurchaseScreen} options={{ headerBackTitle: 'Back', headerTitle: ''}} />
            <Stack.Screen name="StoryHome" component={StoryHomeScreen} options={{ header: () => null }} />
            <Stack.Screen name="StoryMessages" component={StoryTextMessagesScreen} options={{ headerTitle: 'Messages' }} />
            <Stack.Screen name="StoryConversation" component={StoryConversationScreen} options={({ route }) => ({ title: route.params.screenTitle })} />
            <Stack.Screen name="StoryPhotos" component={StoryPhotosScreen} options={() => ({ title: 'Photos' })} />
            <Stack.Screen name="StoryIndividualPhoto" component={StoryIndividualPhotoScreen} options={() => ({ title: '' })} />
            <Stack.Screen name="StoryVoicemail" component={StoryVoicemailScreen} options={() => ({ title: 'Voicemail' })} />
            <Stack.Screen name="StoryAllEmails" component={StoryAllEmailsScreen} options={() => ({ title: 'Email' })} />
            <Stack.Screen name="StoryIndividualEmail" component={StoryIndividualEmailScreen} />
          </>
          :
          <>
            <Stack.Screen name="Splash" component={SplashScreen} options={{ header: () => null }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitle: 'Log In' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerTitle: 'Sign Up' }} />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}
