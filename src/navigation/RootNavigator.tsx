import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInWithKompas from '../screens/Auth/SignInWithKompas';
import InitialScreen from '../screens/Initial';
import AuthScreen from '../screens/Auth';
import {linking} from './linking';
import MainTabNavigator from './MainTabNavigator';
import DataConfirmationScreen from '../screens/InputProfile';
import InputProfileScreen from '../screens/InputProfile/InputProfile';
import PhoneNumberValidationScreen from '../screens/InputProfile/PhoneNumberValidation';
import WebViewScreen from '../screens/Information/WebViewScreen';

export type RootStackParamList = {
  Initial: undefined;
  Auth: undefined;
  SignInWithKompas: undefined;
  DataConfirmation: undefined;
  InputProfile: undefined;
  PhoneNumberValidation?: {phoneNumber?: string};
  Main: undefined | {screen: string};

  EditProfile: undefined;

  WebView: {page: 'faq' | 'about' | 'tnc'};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Initial"
          component={InitialScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignInWithKompas"
          component={SignInWithKompas}
          options={{headerShown: false}}
        />
        <Stack.Group>
          <Stack.Screen
            name="DataConfirmation"
            component={DataConfirmationScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="InputProfile"
            component={InputProfileScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PhoneNumberValidation"
            component={PhoneNumberValidationScreen}
            options={{headerShown: false}}
          />
        </Stack.Group>
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="WebView"
          component={WebViewScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
