import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { Alert, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import HomeScreen from 'screens/HomeScreen';
import HomeHeader from 'screens/HomeHeader';
import Text from 'components/Text';
import Container from 'components/Container'
import { setUser, setUserToken } from '../stores';

const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  icon: {
    marginRight: -15
  },
});

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.storeSlice.user);

  if (!user) {
    return null;
  }

  const onLogoutPress = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      {
        text: 'Yes',
        onPress: async () => {
          await SecureStore.deleteItemAsync('userToken');
          dispatch(setUserToken(null));
          dispatch(setUser({}));
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
      <DrawerItem label="Log out" icon={() => <FontAwesome name={'sign-out'} style={styles.icon} />} onPress={onLogoutPress} />
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
        options={{
          header: (props) => <HomeHeader navigation={props.navigation} />,
          drawerIcon: () => <FontAwesome name={'home'} style={styles.icon}/>
        }}
      />
    </Drawer.Navigator>
  )
}
