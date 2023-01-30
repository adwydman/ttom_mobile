import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen, { HomeHeader } from './src/screens/HomeScreen';
import StoryInfoScreen from './src/screens/StoryInfoScreen';
import ConfirmPurchaseScreen from './src/screens/ConfirmPurchaseScreen';
import StoryHomeScreen from './src/screens/story/StoryHomeScreen';
import StoryTextMessagesScreen from './src/screens/story/StoryTextMessagesScreen';
import StoryConversationScreen from './src/screens/story/StoryConversationScreen';
import { rootStore } from './src/stores';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function requestPermissionsAsync() {
  return await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
}

const Stack = createNativeStackNavigator();

function App() {
  useEffect(() => {
    requestPermissionsAsync()
  }, [])

  const [fontsLoaded] = useFonts({
    Niveau_smallCaps: require('./src/assets/fonts/Niveau_smallCaps.ttf'),
    NiveauGroteskMedium: require('./src/assets/fonts/NiveauGroteskMedium.ttf'),
    NiveauGroteskRegular: require('./src/assets/fonts/NiveauGroteskRegular.ttf'),
    NiveauGroteskLight: require('./src/assets/fonts/NiveauGroteskLight.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={rootStore}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ header: () => <HomeHeader /> }}/>
          <Stack.Screen name="StoryInfo" component={StoryInfoScreen} />
          <Stack.Screen name="ConfirmPurchase" component={ConfirmPurchaseScreen} options={{ headerBackTitle: 'Back', headerTitle: ''}} />
          <Stack.Screen name="StoryHome" component={StoryHomeScreen} options={{ header: () => null }} />
          <Stack.Screen name="StoryMessages" component={StoryTextMessagesScreen} options={{ headerTitle: 'Messages' }} />
          <Stack.Screen name="StoryConversation" component={StoryConversationScreen} options={({ route }) => ({ title: route.params.screenTitle })} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;

{/* <Button
title="Press to schedule a notification"
onPress={async () => {
  await schedulePushNotification();
}}
/> */}
