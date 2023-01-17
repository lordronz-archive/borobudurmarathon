import React from 'react';
import {
  Box,
  Text,
  Button,
  ArrowBackIcon,
  HStack,
  Avatar,
  VStack,
  useTheme,
  Image,
  ScrollView,
  IconButton,
  ChevronRightIcon,
  Center,
  Pressable,
} from 'native-base';
import CookieManager from '@react-native-cookies/cookies';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {EAuthUserAction, useAuthUser} from '../../context/auth.context';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import IconBadge from '../../assets/icons/IconBadge';
import IconSingleUser from '../../assets/icons/IconSingleUser';
import IconInfo from '../../assets/icons/IconInfo';
import IconFileDocument from '../../assets/icons/IconFileDocument';
import {getShortCodeName} from '../../helpers/name';

export default function MyProfile() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  const {dispatch, user} = useAuthUser();
  // const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menus: {
    key: string;
    icon: JSX.Element;
    name: string;
    route: keyof RootStackParamList;
    params?: any;
  }[] = [
    {
      key: 'edit-profile',
      icon: <IconSingleUser color={colors.black} size={6} />,
      name: 'Edit Profile',
      route: 'EditProfile',
    },
    {
      key: 'faqs',
      icon: <IconInfo color={colors.black} size={6} />,
      name: 'FAQs',
      route: 'WebView',
      params: {page: 'faq'},
    },
    {
      key: 'tnc',
      icon: <IconFileDocument color={colors.black} size={6} />,
      name: 'Terms Conditions',
      route: 'WebView',
      params: {page: 'tnc'},
    },
    {
      key: 'about',
      icon: <IconInfo color={colors.black} size={6} />,
      name: 'About Us',
      route: 'WebView',
      params: {page: 'about'},
    },
  ];

  const logout = async () => {
    await CookieManager.clearAll();

    dispatch({type: EAuthUserAction.LOGOUT});

    navigation.navigate('Initial');
  };

  // if (isLoggingOut) {
  //   return <Logout />;
  // }

  return (
    <>
      <ScrollView backgroundColor={colors.white}>
        <Box alignItems="flex-start" padding={1}>
          <IconButton
            onPress={() => navigation.navigate('Main', {screen: 'Home'})}
            icon={<ArrowBackIcon />}
            borderRadius="full"
            _icon={{
              color: colors.black,
              size: 'md',
            }}
            _hover={{
              bg: colors.primary[900] + ':alpha.20',
            }}
            _pressed={{
              bg: colors.primary[900] + ':alpha.20',
              _icon: {
                name: 'emoji-flirt',
              },
            }}
          />
        </Box>

        <HStack space={2} paddingLeft={3} paddingRight={3} alignItems="center">
          <Avatar
            size="lg"
            source={{
              uri: '',
            }}>
            {getShortCodeName(user?.data[0].zmemFullName || 'Unknown Name')}
          </Avatar>
          <VStack paddingLeft={2}>
            <Text fontWeight="bold" fontSize="md">
              {user?.data[0].zmemFullName}
            </Text>
            <Text color={colors.gray[500]} fontSize="sm">
              {user?.linked.zmemAuusId[0].auusEmail}
            </Text>
          </VStack>
        </HStack>

        <Box
          marginX={3}
          marginTop={5}
          marginBottom={7}
          borderWidth={1}
          borderColor={colors.gray[300]}
          borderRadius={8}
          backgroundColor={colors.white}
          shadow="1">
          <VStack padding={3} justifyContent="space-between">
            <IconBadge color={colors.primary[900]} size="lg" />
            <Text marginTop={3} fontWeight={600}>
              View Certificate
            </Text>
          </VStack>
          <Image
            alt="hiasan"
            source={require('../../assets/images/hiasan-color.png')}
            position="absolute"
            right={0}
            bottom={0}
            zIndex={10}
          />
          <Image
            alt="hiasan"
            source={require('../../assets/images/hiasan-shadow.png')}
            position="absolute"
            right={10}
            zIndex={0}
          />
        </Box>

        <Box borderTopColor={colors.gray[500]}>
          {menus.map((menu, index) => (
            <Pressable
              onPress={() => {
                if (menu.route) {
                  navigation.navigate(menu.route, menu.params);
                }
              }}>
              <HStack
                key={menu.key}
                justifyContent="space-between"
                alignItems="center"
                paddingX="3"
                paddingY="4"
                borderTopColor={colors.gray[300]}
                borderTopWidth={0.5}
                borderBottomColor={
                  index === menus.length - 1 ? colors.gray[300] : undefined
                }
                borderBottomWidth={
                  index === menus.length - 1 ? 0.5 : undefined
                }>
                <HStack alignItems="center">
                  {!!menu.icon && menu.icon}
                  <Text marginLeft="1">{menu.name}</Text>
                </HStack>
                <ChevronRightIcon />
              </HStack>
            </Pressable>
          ))}
        </Box>
      </ScrollView>

      <Box padding={3} backgroundColor={colors.white}>
        <Button
          width="100%"
          backgroundColor={colors.white}
          borderColor={colors.gray[500]}
          borderWidth="0.5"
          _text={{color: colors.black, fontWeight: 600}}
          onPress={() => {
            InAppBrowser.closeAuth();
            logout();
            // setIsLoggingOut(true);
            // setTimeout(() => {
            //   logout();
            //   setIsLoggingOut(false);
            // }, 1000);
          }}>
          Sign Out
        </Button>

        <Center marginTop={5}>
          <Text color={colors.gray[500]} fontSize="xs">
            Version App v2.0.0
          </Text>
        </Center>
      </Box>
    </>
  );
}
