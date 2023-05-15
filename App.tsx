import 'react-native-gesture-handler';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import * as Notifications from 'expo-notifications';
import Navigator from 'components/Navigator';
import { rootStore } from './src/stores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    requestPermissionsAsync()
  }, [])

  return (
    <Provider store={rootStore}>
      <QueryClientProvider client={queryClient}>
        <Navigator />
      </QueryClientProvider>
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
