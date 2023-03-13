import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import IconCalendar from '../assets/icons/IconCalendar';
import IconHome from '../assets/icons/IconHome';
import IconUser from '../assets/icons/IconUser';
import MyEvents from '../screens/Event/MyEvents';
import IconChart from '../assets/icons/IconChart';
import HomeScreen from '../screens/Home';
import MyProfile from '../screens/Profile/Profile';
import MyRecords from '../screens/Record/MyRecords';
import {useTheme} from 'native-base';
import IconMore from '../assets/icons/IconMore';
import I18n from '../lib/i18n';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const {colors} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary[900],
      }}>
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
        name={I18n.t('tab.myEvents')}
        component={MyEvents}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <IconCalendar name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={I18n.t('tab.records')}
        component={MyRecords}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <IconChart name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={I18n.t('tab.more')}
        component={MyProfile}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <IconMore name="more" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
