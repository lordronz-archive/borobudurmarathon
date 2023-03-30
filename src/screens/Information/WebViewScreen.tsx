import React, {useState} from 'react';
import WebView from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/RootNavigator';
import LoadingBlock from '../../components/loading/LoadingBlock';
import AppContainer from '../../layout/AppContainer';
import Header from '../../components/header/Header';
import {t} from 'i18next';

export default function WebViewScreen() {
  const urls: any = {
    // faq: 'https://borobudurmarathon.com',
    faq: {
      title: t('info.faqs'),
      url: 'https://borobudurmarathon.com/id/tanya-jawab/',
    },
    about: {title: t('info.aboutUs'), url: 'https://google.com'},
    tnc: {
      title: t('info.termsAndConditions'),
      url: 'https://borobudurmarathon.com/id/ketentuan-myborobudur/',
    },
    default: {title: '', url: 'https://google.com'},
  };

  const route = useRoute();
  const params = route.params as RootStackParamList['WebView'];
  const {url, title} = params.customUrl
    ? params.customUrl
    : urls[params?.page || 'default'];

  const pageTitle = params.title || title;

  const [isLoading, setIsLoading] = useState(true);

  return (
    <AppContainer>
      <Header title={pageTitle} left="back" />
      <WebView source={{uri: url}} onLoadEnd={() => setIsLoading(false)} />
      {isLoading && <LoadingBlock />}
    </AppContainer>
  );
}
