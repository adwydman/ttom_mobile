import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen, { HomeHeader } from 'screens/HomeScreen';

const Drawer = createDrawerNavigator();

export default function HomeDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="HomeScreen" component={HomeScreen} options={{ header: () => <HomeHeader /> }}/>
    </Drawer.Navigator>
  )
}
