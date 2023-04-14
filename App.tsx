import 'react-native-gesture-handler';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import * as Notifications from 'expo-notifications';
import Navigator from 'components/Navigator';
import { rootStore } from './src/stores';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function requestPermissionsAsync() {
  if (Platform.OS === 'ios') {
    return await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
  }
}

async function schedulePushNotification(title, body, data) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, },
    trigger: { seconds: 1 },
  });
}

function App() {
  useEffect(() => {
    requestPermissionsAsync()
  }, [])

  return (
    <Provider store={rootStore}>
      <Navigator />
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
