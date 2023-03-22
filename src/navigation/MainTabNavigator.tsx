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
import {useTranslation} from 'react-i18next';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const {colors} = useTheme();
  const {t} = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary[900],
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}>
      <Tab.Screen
        name={t('tab.home')}
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <IconHome name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={t('tab.myEvents')}
        component={MyEvents}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <IconCalendar name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={t('tab.records')}
        component={MyRecords}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <IconChart name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={t('tab.more')}
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
