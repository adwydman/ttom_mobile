import { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
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
import { setUser, setUserToken } from '../stores';
import { buildUrl } from 'utils/index';

const Stack = createNativeStackNavigator();

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

  if (!fontsLoaded || loading) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Image source={{ uri: 'https://media.tenor.com/RVvnVPK-6dcAAAAC/reload-cat.gif' }} style={{ width: 100, height: 100 }} />
      </View>
    );
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
