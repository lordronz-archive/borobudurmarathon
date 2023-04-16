/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import {
  Actionsheet,
  Box,
  Center,
  extendTheme,
  HStack,
  NativeBaseProvider,
  Text,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import React, {useState} from 'react';
import {
  Alert,
  Linking,
  Platform,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {AuthUserProvider} from './src/context/auth.context';
import {DemoProvider} from './src/context/demo.context';
import RootNavigator from './src/navigation/RootNavigator';
import {useEffect} from 'react';

import remoteConfig from '@react-native-firebase/remote-config';
import {compareVersions} from 'compare-versions';

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './src/lib/i18n/en';
import id from './src/lib/i18n/id';
import Config from 'react-native-config';
import Button from './src/components/buttons/Button';
import {VersionService} from './src/api/version.service.ts';
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3',
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a import { moment } from 'moment';
    // UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {translation: en},
      id: {translation: id},
    },
    lng: 'en', // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

remoteConfig()
  .setDefaults({
    latest_version: '',
  })
  .then(() => remoteConfig().fetchAndActivate())
  .then(fetchedRemotely => {
    if (fetchedRemotely) {
      console.log('Configs were retrieved from the backend and activated.');
    } else {
      console.log(
        'No configs were fetched from the backend, and the local configs were already activated',
      );
    }
  })
  .catch(err => {
    console.info('fetch and activate failed', err);
  });

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isOpenMaintenanceModal, setIsOpenMaintenanceModal] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState<string>();
  const [versionStatus, setVersionStatus] = useState<{
    status: 'FORCE_UPDATE' | 'RECOMMENDED';
    version: string;
  }>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : '#FFF',
  };

  const fontConfig = {
    Poppins: {
      100: {
        normal: 'Poppins-Light',
        italic: 'Poppins-LightItalic',
      },
      200: {
        normal: 'Poppins-Light',
        italic: 'Poppins-LightItalic',
      },
      300: {
        normal: 'Poppins-Light',
        italic: 'Poppins-LightItalic',
      },
      400: {
        normal: 'Poppins-Regular',
        italic: 'Poppins-Italic',
      },
      500: {
        normal: 'Poppins-Medium',
      },
      600: {
        normal: 'Poppins-Medium',
        italic: 'Poppins-MediumItalic',
      },
      700: {
        normal: 'Poppins-Bold',
      },
      800: {
        normal: 'Poppins-Bold',
        italic: 'Poppins-BoldItalic',
      },
      900: {
        normal: 'Poppins-Bold',
        italic: 'Poppins-BoldItalic',
      },
    },
  };

  const fonts = {
    heading: 'Poppins',
    body: 'Poppins',
    mono: 'Poppins',
  };

  const newColorTheme = {
    primary: {
      900: '#EB1C23',
      800: '#e91e63',
    },
    brand: {
      900: '#8287af',
      800: '#7c83db',
      700: '#b3bef6',
    },
  };
  const theme = extendTheme({
    colors: newColorTheme,
    fontConfig,
    fonts,
    components: {
      AlertDialogHeader: {
        baseStyle: {
          borderBottomWidth: 0,
        },
      },
      AlertDialogBody: {
        baseStyle: {
          py: 0,
        },
      },
      AlertDialogFooter: {
        baseStyle: {
          borderTopWidth: 0,
        },
      },
      Button: {
        // Can simply pass default props to change default behaviour of components.
        baseStyle: {
          background: '#EB1C23',
          size: 'lg',
        },
        variants: {
          ghost: {
            bgColor: 'transparent',
          },
          link: {
            bgColor: 'transparent',
          },
          solid: {
            bgColor: '#EB1C23',
          },
        },
      },
      Text: {
        defaultProps: {
          fontFamily: 'Poppins',
        },
      },
      Spinner: {
        defaultProps: {
          size: 'lg',
          color: 'primary.900',
        },
      },
    },
  });

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const myLatestSkippedVersion = await VersionService.getLatestSkip();
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: 60000,
    });

    try {
      const configs = remoteConfig().getAll();
      console.info('result remote configs', configs);

      Object.entries(configs).forEach($ => {
        const [key, entry] = $;
        console.log('Key: ', key);
        // START CHECK VERSION
        if (key === 'latest_version' && entry.asString()) {
          let objLatestVersion: any = {};
          try {
            objLatestVersion = JSON.parse(entry.asString());
          } catch (err) {
            objLatestVersion = {};
          }
          const status = objLatestVersion[Platform.OS + '_status'];
          // const status = 'RECOMMENDED';
          if (status) {
            // const myVersion = '1.0.0';
            const myVersion = Config.APP_VERSION_NAME || '';
            const latestVersion = objLatestVersion[Platform.OS + '_version'];
            const resCompared = compareVersions(myVersion, latestVersion);

            // const resCompared = -1;

            if (resCompared === -1) {
              // need to update
              if (status === 'FORCE_UPDATE') {
                // force
                setVersionStatus({
                  status,
                  version: latestVersion,
                });
              } else {
                // recommended
                if (myLatestSkippedVersion) {
                  const resComparedSkippedVersion = compareVersions(
                    myVersion,
                    myLatestSkippedVersion,
                  );

                  if (resComparedSkippedVersion === 0) {
                    // has been skipped
                  } else {
                    setVersionStatus({
                      status,
                      version: latestVersion,
                    });
                  }
                } else {
                  setVersionStatus({
                    status,
                    version: latestVersion,
                  });
                }
              }
            }
          }
        }
        // END CHECK VERSION

        // START CHECK MAINTENANCE MESSAGE
        if (key === 'maintenance_message') {
          setMaintenanceMessage(entry.asString());
        } else {
          setMaintenanceMessage(undefined);
        }
        // END CHECK MAINTENANCE MESSAGE
        console.log('Source: ', entry.getSource());
        console.log('Value: ', entry.asString());
      });
    } catch (err) {
      console.info('ERROR GETALL REMOTECONFIG', err);
    }
  };

  console.info('versionStatus', versionStatus);

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <AuthUserProvider>
        <DemoProvider>
          <SafeAreaView style={{...backgroundStyle, flex: 1}}>
            {!!maintenanceMessage && (
              <TouchableOpacity onPress={() => setIsOpenMaintenanceModal(true)}>
                <HStack
                  paddingTop="3"
                  paddingBottom="3"
                  width="100%"
                  px="3"
                  bg="warning.300"
                  alignItems="center">
                  <WarningOutlineIcon />
                  <Text pl="2" pr="4" textAlign="center" numberOfLines={1}>
                    {maintenanceMessage}
                  </Text>
                </HStack>
              </TouchableOpacity>
            )}
            <RootNavigator />
          </SafeAreaView>
        </DemoProvider>
      </AuthUserProvider>

      <Actionsheet
        isOpen={isOpenMaintenanceModal}
        onClose={() => setIsOpenMaintenanceModal(false)}>
        <Actionsheet.Content px="3" py="5">
          {maintenanceMessage}
        </Actionsheet.Content>
      </Actionsheet>

      {!!versionStatus && (
        <Box
          position="absolute"
          height="100%"
          width="100%"
          background="gray.100"
          zIndex={999}>
          <VStack
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            px="5"
            space="1">
            <Text bold>New Version Available</Text>
            <Text>Please update your app to continue.</Text>

            <HStack space="1" mt="2">
              {versionStatus.status === 'RECOMMENDED' && (
                <Button
                  style={{
                    flex: 0,
                    paddingHorizontal: 50,
                    backgroundColor: 'gray',
                  }}
                  onPress={() => {
                    Alert.alert(
                      'Confirmation',
                      'Are you sure want to skip this version?',
                      [
                        {
                          text: 'Cancel',
                          style: 'destructive',
                        },
                        {
                          text: 'Yes, Sure',
                          onPress: () => {
                            VersionService.updateLatestSkip(
                              versionStatus.version,
                            );
                            setVersionStatus(undefined);
                          },
                        },
                      ],
                    );
                  }}>
                  Skip
                </Button>
              )}
              <Button
                style={{flex: 0, paddingHorizontal: 50}}
                onPress={() => {
                  if (
                    Platform.OS === 'android' &&
                    Config.URL_DOWNLOAD_ANDROID
                  ) {
                    Linking.openURL(Config.URL_DOWNLOAD_ANDROID);
                  } else if (Platform.OS === 'ios' && Config.URL_DOWNLOAD_IOS) {
                    Linking.openURL(Config.URL_DOWNLOAD_IOS);
                  } else {
                    Linking.openURL(
                      Config.DYNAMIC_LINK_DOMAIN_URI_PREFIX + '/download',
                    );
                  }
                }}>
                Update App
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}
    </NativeBaseProvider>
  );
};

export default App;
