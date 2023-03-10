import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import HomeScreen, { HomeHeader } from 'screens/HomeScreen';
import Text from 'components/Text';
import Container from 'components/Container'
import { setUser, setUserToken } from '../stores';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.storeSlice.user);

  const onLogoutPress = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      {
        text: 'Yes',
        onPress: async () => {
          await SecureStore.deleteItemAsync('userToken');
          dispatch(setUser({}));
          dispatch(setUserToken(null));
        },
      },
      {text: 'No', onPress: () => {}}, // closes the alert
    ]);
  }

  return (
    <DrawerContentScrollView {...props}>
      <Container>
        <Text>{user.email}</Text>
      </Container>
      <DrawerItemList {...props} />
      <DrawerItem label="Log out" onPress={onLogoutPress} />
    </DrawerContentScrollView>
  );
}

export default function HomeDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ header: (props) => <HomeHeader navigation={props.navigation} /> }}
      />
    </Drawer.Navigator>
  )
}
