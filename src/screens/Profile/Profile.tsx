import React, {useState} from 'react';
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
  AlertDialog,
  Toast,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {useAuthUser} from '../../context/auth.context';
import IconBadge from '../../assets/icons/IconBadge';
import IconSingleUser from '../../assets/icons/IconSingleUser';
import IconInfo from '../../assets/icons/IconInfo';
import IconFileDocument from '../../assets/icons/IconFileDocument';
import {getShortCodeName} from '../../helpers/name';
import Logout from './Logout';
import {TouchableOpacity} from 'react-native';
import {AuthService} from '../../api/auth.service';
import {getErrorMessage} from '../../helpers/errorHandler';
import IconUserGroup from '../../assets/icons/IconUserGroup';
import IconPhone from '../../assets/icons/IconPhone';
import useInit from '../../hooks/useInit';
import Config from 'react-native-config';
import config from '../../config';
import IconGlobe from '../../assets/icons/IconGlobe';

export default function MyProfile() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  const {logout} = useInit();
  const {user} = useAuthUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // logout
  const [isOpenModalLogout, setIsOpenModalLogout] = React.useState(false);
  const onCloseModalLogout = () => setIsOpenModalLogout(false);
  const cancelLogoutRef = React.useRef(null);
  const [, setIsLangOpen] = useState(false);

  const menus: {
    key: string;
    icon: JSX.Element;
    name: string;
    route?: keyof RootStackParamList;
    onPress?: () => void;
    params?: any;
  }[] = [
    {
      key: 'edit-profile',
      icon: <IconSingleUser color={colors.black} size={6} />,
      name: 'View Profile',
      route: 'UpdateProfile',
    },
    {
      key: 'edit-phone',
      icon: <IconPhone color={colors.black} size={6} />,
      name: 'Change Phone Number',
      route: 'UpdatePhone',
    },
    {
      key: 'language',
      icon: <IconGlobe color={colors.black} size={6} />,
      name: 'Language',
      onPress: () => setIsLangOpen(true),
    },
    {
      key: 'faqs',
      icon: <IconInfo color={colors.black} size={6} />,
      name: 'FAQs',
      route: 'FAQ',
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
      route: 'AboutUs',
      params: {page: 'about'},
    },
    {
      key: 'partner',
      icon: <IconUserGroup color={colors.black} size={6} />,
      name: 'Partner',
      route: 'Partner',
      params: {page: 'about'},
    },
  ];

  if (isLoggingOut) {
    return (
      <Logout
        onLoadEnd={() => {
          // navigation.navigate('VerifyLater');
          logout(setIsLoggingOut, onCloseModalLogout);
          // logout(setIsLoggingOut, onCloseModalLogout);
        }}
      />
    );
  }

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

        <Pressable onPress={() => navigation.navigate('UpdateProfile')}>
          <HStack
            space={2}
            paddingLeft={3}
            paddingRight={3}
            alignItems="center">
            <Avatar
              bg="gray.400"
              mx={2}
              source={{
                uri: user?.data[0]?.zmemPhoto
                  ? `https://openpub.oss-ap-southeast-5.aliyuncs.com/${user?.data[0]?.zmemPhoto}`
                  : undefined,
              }}>
              {getShortCodeName(user?.data[0].zmemFullName || '')}
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
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Certificates')}>
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
        </Pressable>

        <Box borderTopColor={colors.gray[500]}>
          {menus.map((menu, index) => (
            <TouchableOpacity
              onPress={() => {
                if (menu.route) {
                  navigation.navigate(menu.route, menu.params);
                }
                if (menu.onPress) {
                  menu.onPress();
                }
              }}
              key={`${menu.key}-${index}`}>
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
            </TouchableOpacity>
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
            setIsOpenModalLogout(true);
            // setIsLoggingOut(true);
          }}>
          Sign Out
        </Button>

        {config.isDev && (
          <Button
            width="100%"
            backgroundColor={colors.white}
            borderColor={colors.gray[500]}
            borderWidth="0.5"
            _text={{color: colors.black, fontWeight: 600}}
            onPress={() => {
              AuthService.deleteprofile()
                .then(_res => {
                  navigation.navigate('Logout');
                })
                .catch(err => {
                  Toast.show({
                    description: getErrorMessage(err),
                  });
                });
            }}>
            Sign Out & Delete Profile
          </Button>
        )}

        <Center marginTop={5}>
          <Text color={colors.gray[500]} fontSize="xs">
            Version App v{Config.APP_VERSION_NAME} (build:{' '}
            {Config.APP_VERSIONC_CODE})
          </Text>

          {config.isDev && (
            <Text color={colors.gray[500]} fontSize="xs">
              ~ development ~
            </Text>
          )}
        </Center>
      </Box>

      <AlertDialog
        leastDestructiveRef={cancelLogoutRef}
        isOpen={isOpenModalLogout}
        onClose={onCloseModalLogout}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Confirmation</AlertDialog.Header>
          <AlertDialog.Body>Are you sure want to sign out?</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                bg="white"
                size="sm"
                onPress={onCloseModalLogout}
                ref={cancelLogoutRef}>
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="danger"
                onPress={() => {
                  // setIsLoggingOut(true);
                  onCloseModalLogout();
                  navigation.navigate('Logout');
                }}>
                Yes, Sure
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  );
}
