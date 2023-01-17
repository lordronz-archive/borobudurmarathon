import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import IconCalendar from '../assets/icons/IconCalendar';
import IconHome from '../assets/icons/IconHome';
import IconUser from '../assets/icons/IconUser';
import MyEvents from '../screens/Event/MyEvents';
import IconChart from '../assets/icons/IconChart';
import HomeScreen from '../screens/Home';
import MyProfile from '../screens/Profile/Profile';
import MyRecords from '../screens/Record/MyRecords';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <IconHome name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="My Events"
        component={MyEvents}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <IconCalendar name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Records"
        component={MyRecords}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <IconChart name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={MyProfile}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <IconUser name="profile" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
