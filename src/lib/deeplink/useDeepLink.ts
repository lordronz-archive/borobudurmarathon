/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
import {Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getDynamicUrlParams} from './dynamicLink';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import { t } from 'i18next';

const useMount = (func: any) => useEffect(() => func(), []);

export default function useInitialURL() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [url, setUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [params, setParams] = useState({});

  useEffect(() => {
    console.info('HALOOOOO');
    Linking.addEventListener('url', handleDeeplink);

    return () => Linking.removeAllListeners('url');
  }, []);

  useMount(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl: any = await Linking.getInitialURL();

      console.info('initialUrl before', initialUrl);
      if (initialUrl && initialUrl.url) {
        handleDeeplink(initialUrl.url);
      } else if (initialUrl) {
        handleDeeplink(initialUrl);
      } else {
        setProcessing(false);
      }
    };

    getUrlAsync();
  });

  const handleDeeplink = (initialUrl: any) => {
    console.info('handleDeeplink', initialUrl);
    if (!initialUrl || url === initialUrl) {
      return;
    }
    setProcessing(true);
    console.info('initialUrl handleDeeplink', initialUrl);

    if (initialUrl && initialUrl.url) {
      initialUrl = initialUrl.url;
    }

    setUrl(initialUrl);

    if (initialUrl) {
      // PAYMENT
      if (initialUrl.includes('/auth-callback')) {
        console.info('deeplink auth-callback');
        let initParams: any = {};
        if (initialUrl && initialUrl.includes('?')) {
          const exp = (initialUrl || '').split('?');
          if (exp.length > 1) {
            let expParams;

            if (exp[2]) {
              expParams = exp[2].split('&');
            } else {
              expParams = exp[1].split('&');
            }

            for (const par of expParams) {
              const expPar = par.split('=');
              initParams[expPar[0]] = expPar[1];
            }
            console.info('initParams', initParams);
            setParams(initParams);

            /* Example response payload
              {
                "link": "https://e79c-182-1-122-66.ap.ngrok.io",
                "paymentId": "1af4ce63-393c-4fd1-8070-0f530e9f44c8",
                "paymentVendorId": "GCASH",
                "status": "success",
                "transactionId": "e7e5613b-a0ff-4120-85b6-77710a33ae1e"
                "totalNeedToPay": 1600
              }
            */

            navigation.navigate('Main', {screen: 'Home'});
            // navigation.navigate('PaymentCallback', {
            //   params: {...initParams},
            // });
          }
        }
      }

      if (initialUrl.includes('/INVOICE')) {
        let initParams: any = {};
        if (initialUrl && initialUrl.includes('?')) {
          const exp = (initialUrl || '').split('?');
          if (exp.length > 1) {
            let expParams;

            if (exp[2]) {
              expParams = exp[2].split('&');
            } else {
              expParams = exp[1].split('&');
            }

            for (const par of expParams) {
              const expPar = par.split('=');
              initParams[expPar[0]] = expPar[1];
            }
            console.info('initParams', initParams);
            setParams(initParams);

            navigation.navigate('Main', {screen: t('tab.myEvents')});
            navigation.navigate('MyEventsDetail', {
              // transactionId: item.mregOrderId,
              // eventId: event.evnhId,
              // isBallot: item.mregType === 'MB' ? true : false,
              // regStatus: item.mregStatus,
            });
          }
        }
      }

      // EVENT DETAIL
      if (initialUrl.includes('/events/')) {
        const id = getDynamicUrlParams(initialUrl, '/events/');
        console.info('id', id);
        navigation.navigate('Main', {screen: t('tab.home')});
        navigation.navigate('EventDetail', {
          id: Number(id),
        });
      }

      // else if (initialUrl.includes('/promotion/')) {
      //   const id = getDynamicUrlParams(initialUrl, '/promotion/');
      //   console.info('id', id);
      //   navigation.navigate('Main');
      //   navigation.navigate('ContentDetail', {
      //     newsId: id,
      //     newsType: ENewsType.PROMOTION,
      //   });
      // } else if (initialUrl.includes('/new-content/')) {
      //   const id = getDynamicUrlParams(initialUrl, '/new-content/');
      //   console.info('id', id);
      //   navigation.navigate('Main');
      //   navigation.navigate('ContentDetail', {
      //     newsId: id,
      //     newsType: 'new-content',
      //   });
      // } else if (initialUrl.includes('/product/')) {
      //   const id = getDynamicUrlParams(initialUrl, '/product/');
      //   console.info('id', id);
      //   navigation.navigate('Main', {screen: 'Catalog'});
      //   navigation.navigate('ProductDetail', {
      //     productId: id,
      //   });
      // }
    }
    setProcessing(false);
  };

  return {url, params, processing, handleDeeplink};
}
