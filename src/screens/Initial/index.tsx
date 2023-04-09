/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {Box, Toast} from 'native-base';
import useInit from '../../hooks/useInit';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import config from '../../config';
import {useState} from 'react';
import WebView from 'react-native-webview';
import {getCookiesString} from '../../api/cookies';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import LoadingBlock from '../../components/loading/LoadingBlock';
import AppContainer from '../../layout/AppContainer';
import useDeeplinkInit from '../../lib/deeplink/useDeeplinkInit';
import {t} from 'i18next';

const uri =
  config.apiUrl.href.href + config.apiUrl.apis.member.checkSession.path;

export default function InitialScreen() {
  const isFocused = useIsFocused();
  const route: any = useRoute();

  console.info('InitialScreen -- route', route);
  const path = route.path; // "/events/368"

  console.info('InitialScreen -- params', route.params);

  const {init} = useInit();
  const [isLoadingWebView, setIsLoadingWebView] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const _resDLI = useDeeplinkInit();

  useEffect(() => {
    if (isFocused) {
      if (!isLoadingWebView) {
        setIsLoadingWebView(true);
      }
    }
  }, [isFocused]);

  if (isLoadingWebView) {
    console.info('Initial isLoadingWebView -> uri', uri);
    return (
      <AppContainer>
        <Box flex={1}>
          <WebView
            source={{
              uri,
            }}
            onError={() => {
              setIsLoadingWebView(false);
              // navigation.navigate('Auth');
            }}
            onLoadEnd={async () => {
              const cookiesString = await getCookiesString();
              console.info('Initial cookiesString', cookiesString);

              if (cookiesString) {
                if (route.name === 'InitialEvent') {
                  init([
                    {path: 'Main'},
                    {path: 'EventDetail', params: {id: route?.params?.id}},
                  ]);
                } else if (route.name === 'InitialPayment') {
                  if (route?.params?.id) {
                    init([
                      {path: 'Main', params: {screen: t('tab.myEvents')}},
                      {
                        path: 'MyEventsDetail',
                        params: {
                          transactionId: route?.params?.id || '',
                          // eventId: 0,
                          // isBallot: 0,
                          // regStatus: 1,
                        },
                      },
                    ]);
                  } else {
                    init([{path: 'Main', params: {screen: t('tab.myEvents')}}]);
                  }
                } else {
                  init();
                }
                setIsLoadingWebView(false);
              } else {
                Toast.show({
                  title: 'Failed to get cookies',
                  description:
                    "We can't get the cookies, please try again later.",
                });
                navigation.navigate('Auth');
                setIsLoadingWebView(false);
              }
            }}
            contentMode="mobile"
            thirdPartyCookiesEnabled={true}
            sharedCookiesEnabled={true}
          />

          {isLoadingWebView && (
            <LoadingBlock text={t('message.preparing') + '...'} />
          )}
        </Box>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <LoadingBlock
        text={t('message.preparing') + '... ' + t('pleaseWait') + '...'}
      />
    </AppContainer>
  );
}
