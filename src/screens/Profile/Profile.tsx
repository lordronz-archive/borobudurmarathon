import React, {useEffect} from 'react';
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
  useDisclose,
  Actionsheet,
  CheckCircleIcon,
  Spinner,
} from 'native-base';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {useAuthUser} from '../../context/auth.context';
import IconBadge from '../../assets/icons/IconBadge';
import IconSingleUser from '../../assets/icons/IconSingleUser';
import IconInfo from '../../assets/icons/IconInfo';
import IconFileDocument from '../../assets/icons/IconFileDocument';
import {getFullNameFromData, getShortCodeName} from '../../helpers/name';
import {TouchableOpacity} from 'react-native';
import {AuthService} from '../../api/auth.service';
import {getErrorMessage} from '../../helpers/errorHandler';
import IconUserGroup from '../../assets/icons/IconUserGroup';
import IconPhone from '../../assets/icons/IconPhone';
import Config from 'react-native-config';
import config from '../../config';
import IconGlobe from '../../assets/icons/IconGlobe';
import i18next from 'i18next';
import {useTranslation} from 'react-i18next';
import {LanguageID} from '../../types/language.type';
import httpRequest from '../../helpers/httpRequest';
import AppContainer from '../../layout/AppContainer';
import useInit from '../../hooks/useInit';

export default function MyProfile() {
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  const {user, isVerified} = useAuthUser();
  const {getProfile, isLoadingProfile} = useInit();

  // logout
  const [isOpenModalLogout, setIsOpenModalLogout] = React.useState(false);
  const onCloseModalLogout = () => setIsOpenModalLogout(false);
  const cancelLogoutRef = React.useRef(null);
  const {t} = useTranslation();
  const {isOpen, onOpen, onClose} = useDisclose();

  useEffect(() => {
    if (isFocused) {
      getProfile();
    }
  }, [isFocused]);

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
      name: t('profile.viewProfile'),
      route: 'UpdateProfile',
    },
    {
      key: 'edit-phone',
      icon: <IconPhone color={colors.black} size={6} />,
      name: t('profile.changePhoneNumber'),
      route: 'UpdatePhone',
    },
    {
      key: 'language',
      icon: <IconGlobe color={colors.black} size={6} />,
      name: t('profile.language'),
      onPress: onOpen,
    },
    {
      key: 'faqs',
      icon: <IconInfo color={colors.black} size={6} />,
      name: t('info.faqs'),
      route: 'FAQ',
    },
    {
      key: 'tnc',
      icon: <IconFileDocument color={colors.black} size={6} />,
      name: t('info.termsAndConditions'),
      route: 'WebView',
      params: {page: 'tnc'},
    },
    {
      key: 'about',
      icon: <IconInfo color={colors.black} size={6} />,
      name: t('info.aboutUs'),
      route: 'AboutUs',
      params: {page: 'about'},
    },
    {
      key: 'partner',
      icon: <IconUserGroup color={colors.black} size={6} />,
      name: 'Partner',
      route: 'Partner',
    },
  ];

  const changeLanguage = async (langId: LanguageID) => {
    i18next.changeLanguage(langId === LanguageID.EN ? 'en' : 'id');
    const url =
      config.apiUrl.href.href +
      config.apiUrl.apis.member.setLanguage.path +
      langId;
    await httpRequest.get(url);
  };

  return (
    <AppContainer>
      <ScrollView backgroundColor={colors.white}>
        <Box alignItems="flex-start" padding={1}>
          <IconButton
            onPress={() => navigation.navigate('Main', {screen: t('tab.home')})}
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
                uri:
                  user &&
                  user.data &&
                  user.data.length > 0 &&
                  user?.data[0]?.zmemPhoto
                    ? `https://openpub.oss-ap-southeast-5.aliyuncs.com/${user?.data[0]?.zmemPhoto}`
                    : undefined,
              }}>
              {getShortCodeName(getFullNameFromData(user))}
            </Avatar>
            <VStack paddingLeft={2}>
              <HStack alignItems="center" width="75%">
                <Text fontWeight="bold" fontSize="md" numberOfLines={1} mr="2">
                  {getFullNameFromData(user)}
                </Text>
                {isVerified && <CheckCircleIcon color="blue.600" />}

                {isLoadingProfile && <Spinner size="sm" ml="1" />}
                {/* <Badge ml="2" colorScheme="success" variant="subtle">
                  <HStack alignItems="center">
                    <CheckIcon color="white" />
                    <Text color="white" fontSize="sm" ml="1">
                      verified
                    </Text>
                  </HStack>
                </Badge> */}
              </HStack>
              <Text color={colors.gray[500]} fontSize="sm">
                {user &&
                user.linked &&
                user?.linked.zmemAuusId.length > 0 &&
                user?.linked.zmemAuusId[0].auusEmail
                  ? user?.linked.zmemAuusId[0].auusEmail
                  : ''}
              </Text>
            </VStack>
          </HStack>
          {!config.isShowFeatureCertificate && (
            <Box
              marginX={0}
              marginTop={0}
              marginBottom={7}
              backgroundColor={colors.white}>
              <Image
                alt="hiasan"
                source={require('../../assets/images/hiasan-color.png')}
                position="absolute"
                right={0}
                top={-90}
                zIndex={-1}
              />
              <Image
                alt="hiasan"
                source={require('../../assets/images/hiasan-shadow.png')}
                position="absolute"
                right={0}
                top={-95}
                zIndex={-2}
              />
            </Box>
          )}
        </Pressable>

        {config.isShowFeatureCertificate && (
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
        )}

        {/* <Alert bgColor="warning.300" mx="2">
          <HStack alignItems="center">
            <WarningOutlineIcon color="black" />
            <Text ml="1" fontSize="xs">
              {t('profile.alertNotVerifiedMessage')}
            </Text>
          </HStack>
        </Alert> */}

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
          <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
            <Actionsheet.Content borderTopRadius="0">
              <Box
                w="100%"
                h={60}
                px={4}
                justifyContent="center"
                alignItems="center"
                fontWeight="bold">
                <Text
                  fontSize="20"
                  color="gray.900"
                  _dark={{
                    color: 'gray.300',
                  }}>
                  {t('profile.changeLanguage')}
                </Text>
              </Box>
              <Actionsheet.Item onPress={() => changeLanguage(LanguageID.EN)}>
                <HStack
                  w={i18next.language === 'en' ? '85%' : '100%'}
                  alignItems="center"
                  justifyContent="space-between">
                  <HStack alignItems="center" space={2}>
                    <Image
                      alt="English"
                      source={require('../../assets/images/english.png')}
                    />
                    <Text>English</Text>
                  </HStack>
                  {i18next.language === 'en' && (
                    <CheckCircleIcon color="primary.900" />
                  )}
                </HStack>
              </Actionsheet.Item>
              <Actionsheet.Item onPress={() => changeLanguage(LanguageID.ID)}>
                <HStack
                  w={i18next.language === 'id' ? '85%' : '100%'}
                  alignItems="center"
                  justifyContent="space-between">
                  <HStack alignItems="center" space={2}>
                    <Image
                      alt="Indonesia"
                      source={require('../../assets/images/indonesia.png')}
                    />
                    <Text>Indonesia</Text>
                  </HStack>
                  {i18next.language === 'id' && (
                    <CheckCircleIcon color="primary.900" />
                  )}
                </HStack>
              </Actionsheet.Item>
            </Actionsheet.Content>
          </Actionsheet>
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
          {t('auth.signout')}
        </Button>

        {config.isShowDemoSettings && (
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
            v{Config.APP_VERSION_NAME} (build: {Config.APP_VERSION_BUILD})
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
          <AlertDialog.Header>{t('confirmation')}</AlertDialog.Header>
          <AlertDialog.Body>{t('auth.signoutConfirmation')}</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                bg="white"
                size="sm"
                onPress={onCloseModalLogout}
                ref={cancelLogoutRef}>
                {t('cancel')}
              </Button>
              <Button
                size="sm"
                colorScheme="danger"
                onPress={() => {
                  // setIsLoggingOut(true);
                  onCloseModalLogout();
                  navigation.navigate('Logout');
                }}>
                {t('sure')}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </AppContainer>
  );
}
