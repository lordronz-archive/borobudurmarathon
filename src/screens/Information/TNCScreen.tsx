import React from 'react';
import Header from '../../components/header/Header';
import AppContainer from '../../layout/AppContainer';
import InformationList, {
  InformationListProps,
} from './components/InformationList';
import {t} from 'i18next';

export default function TNCScreen() {
  const items: InformationListProps['items'] = [
    {
      name: {id: 'Syarat Ketentuan Aplikasi ', en: 'App Terms and Conditions'},
      route: 'WebView',
      params: {
        url: {
          id: 'https://borobudurmarathon.com/id/ketentuan-myborobudur/',
          en: 'https://borobudurmarathon.com/terms-of-service-myborobudur/',
        },
      },
    },
    {
      name: {id: 'Borobudur Marathon 2023', en: 'Borobudur Marathon 2023'},
      route: 'WebView',
      params: {
        url: {
          id: 'https://borobudurmarathon.com/id/peraturan-ketentuan-borobudur-marathon-2023/',
          en: 'https://borobudurmarathon.com/rules-regulations-borobudur-marathon-2023/',
        },
      },
    },
    {
      name: {
        id: 'Bank Jateng Friendship Run',
        en: 'Bank Jateng Friendship Run',
      },
      route: 'WebView',
      params: {
        url: {
          id: 'https://borobudurmarathon.com/id/syarat-ketentuan-friendship-run-2023/',
          en: 'https://borobudurmarathon.com/terms-conditions-friendship-run-2023/',
        },
      },
    },
  ];

  return (
    <AppContainer>
      <Header title={t('info.termsAndConditions')} left="back" />
      <InformationList items={items} />
    </AppContainer>
  );
}
