import * as React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InitialScreen from '../screens/Initial';
import AuthScreen from '../screens/Auth';
import {linking} from './linking';
import MainTabNavigator from './MainTabNavigator';
import DataConfirmationScreen from '../screens/InputProfile';
import InputProfileScreen from '../screens/InputProfile/InputProfile';
import PhoneNumberValidationScreen from '../screens/InputProfile/PhoneNumberValidation';
import WebViewScreen from '../screens/Information/WebViewScreen';
import FAQScreen from '../screens/Information/FAQScreen';
import WelcomeScreen from '../screens/Welcome/Welcome';
import UpdateProfileScreen from '../screens/Profile/UpdateProfile';
import PaymentScreen from '../screens/Payment';
import EventRegisterScreen from '../screens/Event/Register';
import DetailEvent from '../screens/Event/DetailEvent';
import {
  EventFieldsEntity,
  GetEventResponse,
  PAYMENT_METHODS,
} from '../types/event.type';
import HowToPayScreen from '../screens/HowToPay';
import LogoutScreen from '../screens/Profile/LogoutScreen';
import ChangePhoneNumberScreen from '../screens/Profile/ChangePhoneNumber';
import MyEventDetail from '../screens/Event/MyEventsDetail';
import CertificatesScreen from '../screens/Profile/Certificates';
import PartnerScreen from '../screens/Information/PartnerScreen';
import ChooseCitizenScreen from '../screens/InputProfile/ChooseCitizen';
import EmailValidationForKompasScreen from '../screens/InputProfile/EmailValidationForKompas';
import AboutUsScreen from '../screens/Information/AboutUs';
import SearchLocationScreen from '../screens/InputProfile/SearchLocation';
import SignInEmailScreen from '../screens/Auth/SignInEmail';
import RegisterEmailScreen from '../screens/Auth/RegisterEmail';
import ForgotPasswordScreen from '../screens/Auth/ForgotPassword';
import EmailVerificationWhenRegisterScreen from '../screens/InputProfile/EmailVerificationWhenRegister';
import InfoVerifyLaterScreen from '../screens/Information/InfoVerifyLater';
import TNCScreen from '../screens/Information/TNCScreen';
import VoucherScreen from '../screens/Payment/Voucher';
import ViewDetailRegistrationData from '../screens/Event/components/ViewDetailRegistrationData';
import ResetPasswordScreen from '../screens/Auth/ResetPassword';
import ListInvitationScreen from '../screens/Invitation';
import InvitedEventsScreen from '../screens/Event/InvitedEvents';
import analytics from '@react-native-firebase/analytics';
import UpdateLocationScreen from '../screens/InputProfile/UpdateLocation';

export type RootStackParamList = {
  Initial: undefined;
  InitialEvent: {id: string};
  InitialPayment: {id: string};

  Auth: undefined;
  SignInEmail: undefined;
  RegisterEmail: undefined;
  ForgotPassword: undefined;
  ResetPassword: {code: string; key: string};

  SignInWithKompas: undefined;
  DataConfirmation: undefined;
  InputProfile:
    | {
        mbsdIDNumber: number;
        mbsdBirthDate: Date;
        mbsdBirthPlace: string;
        mbsdBloodType: string;
        mbsdNationality: string;
        mbsdCountry: string;
        mbsdCity: string;
        mbsdProvinces: string;
        mbsdAddress: string;
        mbsdRawAddress: string;
        mbsdIDNumberType: number;
        mbsdFile: number;
        mmedEducation: string;
        mmedOccupation: string;
        mmedIncome: string;
      }
    | undefined;
  PhoneNumberValidation?: {phoneNumber?: string; onSuccess: () => void};
  EmailValidationForKompas?: {email?: string; onSuccess: () => void};
  EmailVerificationWhenRegister?: {email?: string; onSuccess: () => void};
  Main: undefined | {screen: string};
  ChooseCitizen: undefined;
  SearchLocation:
    | undefined
    | {
        onSelect: (val: {
          mlocRegency: string;
          mlocProvince: string;
          mlocName: string;
        }) => void;
      };

  EventDetail: {id: number};

  UpdateProfile: undefined;
  UpdateLocation: undefined;
  Certificates: undefined;
  UpdatePhone: undefined;
  InvitedEvents: undefined;
  Welcome: undefined;
  InfoVerifyLater: undefined;

  FAQ: undefined;
  TNC: undefined;
  Partner: undefined;
  AboutUs: undefined;
  WebView: {page?: 'faq' | 'about' | 'tnc'; customUrl?: string; title?: string};

  Register: undefined;
  EventRegister: {event: GetEventResponse; selectedCategoryId: string};
  MyEventsDetail: {
    transactionId: string;
    // eventId: number;
    // isBallot: boolean;
    // regStatus: number;
  };
  Payment: {transactionId: string};
  Voucher: undefined;
  HowToPay: undefined | {trihPaymentType: keyof typeof PAYMENT_METHODS};
  ViewDetailRegistrationData: {
    data: {[key: string]: string};
    fields: EventFieldsEntity[];
  };

  ListInvitation: undefined;

  Logout: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const routeNameRef: any = React.useRef();
  const navigationRef: any = useNavigationContainerRef();
  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator initialRouteName="Initial">
        <Stack.Screen
          name="Initial"
          component={InitialScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InitialEvent"
          component={InitialScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InitialPayment"
          component={InitialScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignInEmail"
          component={SignInEmailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterEmail"
          component={RegisterEmailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EmailValidationForKompas"
          component={EmailValidationForKompasScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EmailVerificationWhenRegister"
          component={EmailVerificationWhenRegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{headerShown: false}}
        />
        <Stack.Group>
          <Stack.Screen
            name="DataConfirmation"
            component={DataConfirmationScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="InfoVerifyLater"
            component={InfoVerifyLaterScreen}
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
          <Stack.Screen
            name="ChooseCitizen"
            component={ChooseCitizenScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SearchLocation"
            component={SearchLocationScreen}
            options={{headerShown: false}}
          />
        </Stack.Group>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EventDetail"
          component={DetailEvent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EventRegister"
          component={EventRegisterScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="UpdateProfile"
          component={UpdateProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UpdateLocation"
          component={UpdateLocationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Certificates"
          component={CertificatesScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UpdatePhone"
          component={ChangePhoneNumberScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InvitedEvents"
          component={InvitedEventsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FAQ"
          component={FAQScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TNC"
          component={TNCScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Partner"
          component={PartnerScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WebView"
          component={WebViewScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyEventsDetail"
          component={MyEventDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Voucher"
          component={VoucherScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HowToPay"
          component={HowToPayScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ViewDetailRegistrationData"
          component={ViewDetailRegistrationData}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListInvitation"
          component={ListInvitationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Logout"
          component={LogoutScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
