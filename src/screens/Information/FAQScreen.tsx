import React from 'react';
import Header from '../../components/header/Header';
import AppContainer from '../../layout/AppContainer';
import InformationList, {
  InformationListProps,
} from './components/InformationList';
import {t} from 'i18next';

export default function FAQScreen() {
  const items: InformationListProps['items'] = [
    {
      name: {id: 'General', en: 'General'},
      route: 'WebView',
      params: {
        url: {
          id: 'https://borobudurmarathon.com/id/tanya-jawab-apps-myborobudur/',
          en: 'https://borobudurmarathon.com/frequently-asked-questions-apps/',
        },
      },
    },
    {
      name: {id: 'Borobudur Marathon 2023', en: 'Borobudur Marathon 2023'},
      route: 'WebView',
      params: {
        url: {
          id: 'https://borobudurmarathon.com/id/tanya-jawab-borobudur-marathon-2023',
          en: 'https://borobudurmarathon.com/faq-borobudur-marathon-2023/',
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
          id: 'https://borobudurmarathon.com/id/tanya-jawab-friendship-run-2023',
          en: 'https://borobudurmarathon.com/faq-friendship-run-2023/',
        },
      },
    },
    {
      name: {
        id: 'Fast Track Borobudur Marathon 2023',
        en: 'Fast Track Borobudur Marathon 2023',
      },
      route: 'WebView',
      params: {
        url: {
          id: 'https://borobudurmarathon.com/id/tanya-jawab-fast-track-2023/',
          en: 'https://borobudurmarathon.com/faq-fast-track-2023/',
        },
      },
    },
    // {
    //   name: 'Hari & Lomba',
    //   route: 'WebView',
    //   params: {url: 'https://borobudurmarathon.com/id/hari-lomba-2022/'},
    // },
    // {
    //   name: 'Elite Race',
    //   route: 'WebView',
    //   params: {url: 'https://borobudurmarathon.com/id/elite-race/'},
    // },
    // {
    //   name: 'Tilik Candi',
    //   route: 'WebView',
    //   params: {
    //     url:
    //       'https://borobudurmarathon.com/id/tanya-jawab-tilik-candi-2022/',
    //   },
    // },
    // {
    //   name: 'Young Talent',
    //   route: 'WebView',
    //   params: {
    //     url:
    //       'https://borobudurmarathon.com/id/tanya-jawab-bank-jateng-young-talent-2022/',
    //   },
    // },
    // {
    //   name: 'Akomodasi',
    //   route: 'WebView',
    //   params: {
    //     url: 'https://borobudurmarathon.com/id/akomodasi/',
    //   },
    // },
    // {
    //   name: 'Transportasi',
    //   route: 'WebView',
    //   params: {
    //     url: 'https://borobudurmarathon.com/id/transportasi/',
    //   },
    // },
    // {
    //   name: 'Panduan Kota Magelang',
    //   route: 'WebView',
    //   params: {
    //     url: 'https://borobudurmarathon.com/id/panduan-kota/',
    //   },
    // },
  ];

  return (
    <AppContainer>
      <Header title={t('info.faqs')} left="back" />
      <InformationList items={items} />
    </AppContainer>
  );
}
