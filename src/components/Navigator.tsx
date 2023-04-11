import { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { useSelector, useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeDrawer from 'drawers/HomeDrawer';
import LoginScreen from 'screens/LoginScreen';
import SplashScreen from 'screens/SplashScreen';
import RegisterScreen from 'screens/RegisterScreen';
import StoryInfoScreen from 'screens/StoryInfoScreen';
import ConfirmPurchaseScreen from 'screens/ConfirmPurchaseScreen';
import StoryHomeScreen from 'screens/story/StoryHomeScreen';
import StoryTextMessagesScreen from 'screens/story/StoryTextMessagesScreen';
import StoryConversationScreen from 'screens/story/StoryConversationScreen';
import LoadingSplash from './LoadingSplash';
import { setUser, setUserToken } from '../stores';
import { buildUrl } from 'utils/index';

const Stack = createNativeStackNavigator();

async function evictExpiredMessages() {
  const currentTime = new Date().getTime();
  const timeLimit = 60 * 60 * 1000; // 1 hours in milliseconds
  // const timeLimit = 24 * 60 * 60 * 1000; // 24 hours in milliseconds


  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const messagesKeys = allKeys.filter((key) => key.includes('messages'));

    for (const key of messagesKeys) {
      // await AsyncStorage.removeItem(key);

      // const [_, _2, timestamp] = key.split('_');
      // const age = currentTime - parseInt(timestamp, 10);
      // if (age > timeLimit) {
      //   await AsyncStorage.removeItem(key);
      // }
    }
  } catch (error) {
    console.error('Error evicting expired messages:', error);
  }
}

export default function Navigator() {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const userToken = useSelector((state: any) => state.storeSlice.userToken);

  const [fontsLoaded] = useFonts({
    LibreCaslonTextBold: require('../assets/fonts/LibreCaslonText-Bold.ttf'),
    Niveau_smallCaps: require('../assets/fonts/Niveau_smallCaps.ttf'),
    NiveauGroteskMedium: require('../assets/fonts/NiveauGroteskMedium.ttf'),
    NiveauGroteskRegular: require('../assets/fonts/NiveauGroteskRegular.ttf'),
    NiveauGroteskLight: require('../assets/fonts/NiveauGroteskLight.ttf'),
  });

  useEffect(() => {
    const asyncFn = async () => {
      const storeUserToken = await SecureStore.getItemAsync('userToken');

      // await SecureStore.deleteItemAsync('userToken');
      if (storeUserToken) {
        dispatch(setUserToken(storeUserToken))
        const fetchResult = await fetch(buildUrl(`/users?userToken=${storeUserToken}`))
        const result = await fetchResult.json();
        
        if (result.user) {
          dispatch(setUser(result.user));
        }
      }

      setLoading(false);
    }
    asyncFn();
  }, []);

  useEffect(() => {
    const asyncFn = async () => {
      await evictExpiredMessages();
    };
    asyncFn();
  }, []);

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
