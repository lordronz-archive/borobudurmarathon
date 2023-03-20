/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {Box, Toast} from 'native-base';
import useInit from '../../hooks/useInit';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import config from '../../config';
import {useState} from 'react';
import WebView from 'react-native-webview';
import {getCookiesString} from '../../api/cookies';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import LoadingBlock from '../../components/loading/LoadingBlock';

const uri =
  config.apiUrl.href.href + config.apiUrl.apis.member.checkSession.path;

export default function InitialScreen() {
  const isFocused = useIsFocused();
  const {init} = useInit();
  const [isLoadingWebView, setIsLoadingWebView] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (isFocused) {
      // init();
      if (!isLoadingWebView) {
        setIsLoadingWebView(true);
      }
    }
  }, [isFocused]);

  if (isLoadingWebView) {
    console.info('Initial isLoadingWebView -> uri', uri);
    return (
      <Box flex={1}>
        <WebView
          source={{
            uri,
          }}
          onError={() => setIsLoadingWebView(false)}
          onLoadEnd={async () => {
            const cookiesString = await getCookiesString();
            console.info('Initial cookiesString', cookiesString);

            if (cookiesString) {
              init();
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

        {isLoadingWebView && <LoadingBlock text="Preparing..." />}
      </Box>
    );
  }

  return <LoadingBlock text="Preparing... Please wait..." />;
}
