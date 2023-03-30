import React, {useState} from 'react';
import WebView from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/RootNavigator';
import LoadingBlock from '../../components/loading/LoadingBlock';
import AppContainer from '../../layout/AppContainer';
import Header from '../../components/header/Header';
import i18next, {t} from 'i18next';

export default function WebViewScreen() {
  const urls: any = {
    // faq: 'https://borobudurmarathon.com',
    faq: {
      title: t('info.faqs'),
      url: {
        id: 'https://borobudurmarathon.com/id/tanya-jawab-apps-myborobudur/',
        en: 'https://borobudurmarathon.com/frequently-asked-questions-apps/',
      },
    },
    about: {title: t('info.aboutUs'), url: 'https://google.com'},
    tnc: {
      title: t('info.termsAndConditions'),
      url: {
        id: 'https://borobudurmarathon.com/id/ketentuan-myborobudur/',
        en: 'https://borobudurmarathon.com/terms-of-service-myborobudur/',
      },
    },
    default: {title: '', url: 'https://borobudurmarathon.com'},
  };

  const route = useRoute();
  const params: any = route.params as RootStackParamList['WebView'];
  const {url, title} = params ? params : urls[params?.page || 'default'];
  console.info('url -----', url);

  const pageTitle = params.title || title;

  const [isLoading, setIsLoading] = useState(true);

  return (
    <AppContainer>
      <Header title={pageTitle} left="back" />
      <WebView
        source={{uri: typeof url === 'object' ? url[i18next.language] : url}}
        onLoadEnd={() => setIsLoading(false)}
      />
      {isLoading && <LoadingBlock />}
    </AppContainer>
  );
}
