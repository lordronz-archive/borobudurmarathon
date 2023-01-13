import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MyEvents from '../screens/Event/MyEvents';
import HomeScreen from '../screens/Home';
import MyProfile from '../screens/Profile/Profile';
import MyRecords from '../screens/Record/MyRecords';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="My Events" component={MyEvents} />
      <Tab.Screen name="Records" component={MyRecords} />
      <Tab.Screen name="Profile" component={MyProfile} />
    </Tab.Navigator>
  );
}
