import React, {useEffect, useState} from 'react';
import {
  Box,
  useTheme,
  ScrollView,
  HStack,
  Text,
  VStack,
  ChevronRightIcon,
  Image,
  Divider,
  Button,
  Toast,
  useClipboard,
} from 'native-base';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Header from '../../components/header/Header';
import IconInfo from '../../assets/icons/IconInfo';
import {TouchableOpacity} from 'react-native';
import {EVENT_TYPES} from '../../types/event.type';
import {EventService} from '../../api/event.service';
import datetime from '../../helpers/datetime';
import moment from 'moment';
import LoadingBlock from '../../components/loading/LoadingBlock';
import IconCircleCheck from '../../assets/icons/IconCircleCheck';
import WebView from 'react-native-webview';
import {useTranslation} from 'react-i18next';
import AppContainer from '../../layout/AppContainer';
import {TransactionDetail} from '../../types/transaction.type';
import {handleErrorMessage} from '../../helpers/apiErrors';

export default function PaymentScreen() {
  const {onCopy} = useClipboard();
  const IsFocused = useIsFocused();
  const route = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const params = route.params as RootStackParamList['Payment'];

  const {colors} = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [detailTransaction, setDetailTransaction] =
    useState<TransactionDetail>();
  const [activePayment, setActivePayment] = useState<any>();

  const {t} = useTranslation();

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await EventService.getTransactionDetail(params.transactionId);
      console.info('payment - res transaction', JSON.stringify(res));
      if (res && res.data) {
        setDetailTransaction(res.data);
        setActivePayment(
          res.data?.linked?.trihTrnsId?.find(
            (item: any) => item.trihIsCurrent === 1,
          ),
        );
      }
    } catch (err) {
      handleErrorMessage(err, t('error.failedToGetTransaction'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [IsFocused]);

  const DATA_LIST = [
    {
      title: 'Order at',
      value: `${moment(detailTransaction?.data?.trnsCreatedTime).format(
        'DD MMM YYYY, HH:mm',
      )}`,
    },
    {
      title: 'Total Payment',
      value: `IDR ${Number(detailTransaction?.data?.trnsAmount)?.toLocaleString(
        'id-ID',
      )}`,
    },
  ];

  const DATA_PAYMENT = [
    {
      title: 'Payment Method',
      value:
        activePayment?.trihPaymentType === 'save_duit' ? (
          'Save Duit'
        ) : activePayment?.trihPaymentType === 'virtual_account_jateng' ? (
          <Image
            source={require('../../assets/images/logo-bank-jateng.png')}
            width={'80px'}
            height={'40px'}
            alt="Bank Sulteng Logo"
            resizeMode="contain"
          />
        ) : (
          'Bank BNI Virtual Account'
        ),
    },
    {
      title: 'Bank Code',
      value:
        activePayment?.trihPaymentType === 'virtual_account_jateng' ||
        activePayment?.trihPaymentType === 'save_duit'
          ? '113 - Bank Jateng'
          : '009 - Bank BNI',
    },
    {
      title:
        activePayment?.trihPaymentType === 'save_duit'
          ? 'Billing Code'
          : 'Virtual Account',
      value:
        activePayment?.trihPaymentType === 'save_duit'
          ? detailTransaction?.linked?.saduTrnsId?.[0]?.saduSaveduitNumber
          : activePayment?.trihPaymentType === 'virtual_account_jateng'
          ? detailTransaction?.linked?.jtvaTrnsId?.[0]?.jtvaVANumber
          : detailTransaction?.linked?.bnivTrnsId?.[0]?.bnivVANumber,
    },
  ];

  return (
    <AppContainer>
      <Header title="" left="back" />
      {isLoading ? (
        <LoadingBlock style={{opacity: 0.7}} />
      ) : (
        <>
          {activePayment?.trihPaymentType?.includes('snap') &&
          activePayment.trihIsPaid === 0 ? (
            <Box flex={1}>
              <WebView
                source={{
                  uri: `https://pay.borobudurmarathon.com/${detailTransaction?.linked?.vrtrTrnsId?.[0]?.vrtrURL}`,
                }}
                thirdPartyCookiesEnabled={true}
                contentMode="mobile"
              />
            </Box>
          ) : (
            <ScrollView
              backgroundColor={colors.white}
              marginX={15}
              showsVerticalScrollIndicator={false}>
              <HStack paddingY={'16px'}>
                <Image
                  w="62px"
                  h="62px"
                  marginRight={'15px'}
                  borderRadius={5}
                  source={
                    detailTransaction?.linked?.trnsEventId?.[0]?.evnhThumbnail
                      ? {
                          uri: detailTransaction?.linked?.trnsEventId?.[0]
                            ?.evnhThumbnail,
                        }
                      : require('../../assets/images/no-image.png')
                  }
                  alt="Event Thumbnail"
                />

                <VStack flex={1} width="90%">
                  <Text fontSize={12} fontWeight={600} color={'#768499'}>
                    {(detailTransaction?.linked?.trnsEventId?.[0]?.evnhType
                      ? EVENT_TYPES[
                          detailTransaction?.linked?.trnsEventId?.[0]
                            ?.evnhType as any
                        ].value || 'OTHER'
                      : 'OTHER'
                    ).toUpperCase()}{' '}
                    •{' '}
                    {
                      detailTransaction?.linked?.trndTrnsId?.[0]
                        ?.trndDescription
                    }
                  </Text>
                  <Text
                    fontSize={13}
                    fontWeight={400}
                    color={'#1E1E1E'}
                    numberOfLines={1}>
                    {detailTransaction?.linked?.trnsEventId?.[0]?.evnhName}
                  </Text>
                </VStack>
              </HStack>
              <HStack
                borderTopColor={'#E8ECF3'}
                borderTopWidth={1}
                borderTopStyle={'solid'}
                paddingY={'16px'}>
                <VStack width={'50%'}>
                  <Text fontWeight={400} color="#768499" fontSize={10}>
                    {t('event.registrationDate')}
                  </Text>
                  <Text fontWeight={400} color="#1E1E1E" fontSize={12}>
                    {datetime.getDateString(
                      detailTransaction?.data?.trnsCreatedTime,
                      'short',
                      'short',
                    )}
                  </Text>
                </VStack>
                <VStack width={'50%'}>
                  <Text fontWeight={400} color="#768499" fontSize={10}>
                    {t('event.runningDate')}
                  </Text>
                  <Text fontWeight={400} color="#1E1E1E" fontSize={12}>
                    {datetime.getDateRangeString(
                      detailTransaction?.linked?.trnsEventId?.[0]
                        ?.evnhStartDate,
                      detailTransaction?.linked?.trnsEventId?.[0]?.evnhEndDate,
                      'short',
                      'short',
                    )}
                  </Text>
                </VStack>
              </HStack>
              <Divider height={'8px'} bg={'#E8ECF3'} />
              <VStack
                paddingY={'16px'}
                borderBottomColor={'#E6E9EF'}
                borderBottomWidth={1}
                borderBottomStyle={'solid'}>
                <Text fontWeight={600} fontSize={14} color={'#1E1E1E'}>
                  {t('payment.paymentInformation')}
                </Text>
                <Text fontWeight={400} fontSize={11} color={'#768499'}>
                  {t('payment.ensurePayment')}
                </Text>
              </VStack>
              <VStack>
                <Text
                  fontWeight={600}
                  fontSize={12}
                  color={'#1E1E1E'}
                  paddingY={'12px'}
                  textAlign={'center'}>
                  {t('payment.completePaymentBefore')}
                </Text>
                <Box paddingY={'12px'} bg={'#F4F6F9'} borderRadius={5}>
                  <Text
                    fontWeight={500}
                    fontSize={16}
                    color={'#1E1E1E'}
                    textAlign={'center'}>
                    {`${moment(detailTransaction?.data?.trnsExpiredTime).format(
                      'DD MMM YYYY, HH:mm',
                    )}`}
                  </Text>
                </Box>
              </VStack>
              {DATA_LIST.map(item => (
                <Box
                  key={item.title}
                  paddingY={'16px'}
                  borderBottomColor={'#E8ECF3'}
                  borderBottomWidth={1}
                  borderBottomStyle={'solid'}>
                  <HStack justifyContent={'space-between'}>
                    <Text fontWeight={400} color="#768499" fontSize={11}>
                      {item.title}
                    </Text>
                    <Text fontWeight={'bold'} color="#1E1E1E" fontSize={12}>
                      {item.value}
                    </Text>
                  </HStack>
                </Box>
              ))}
              {detailTransaction?.data?.trnsConfirmed === 0 ? (
                <>
                  {DATA_PAYMENT.map(item =>
                    activePayment?.trihPaymentType === 'save_duit' &&
                    item.title === 'Bank Code' ? (
                      <></>
                    ) : (
                      <Box
                        key={item.title}
                        borderBottomColor={'#E8ECF3'}
                        borderBottomWidth={1}
                        borderBottomStyle={'solid'}>
                        <HStack
                          justifyContent={'space-between'}
                          alignItems={'center'}>
                          <Text
                            fontWeight={400}
                            color="#768499"
                            fontSize={11}
                            paddingY={'16px'}>
                            {item.title}
                          </Text>
                          <HStack>
                            {typeof item.value !== 'string' ? (
                              item.value
                            ) : (
                              <Text
                                fontWeight={'bold'}
                                color="#1E1E1E"
                                paddingY={'16px'}
                                fontSize={12}>
                                {item.value}
                              </Text>
                            )}
                            {(item.title === 'Virtual Account' ||
                              item.title === 'Billing Code') && (
                              <TouchableOpacity
                                style={{paddingVertical: 16}}
                                onPress={() => {
                                  onCopy(item.value as any);
                                  Toast.show({
                                    title: `${item.title} Copy to Clipboard`,
                                  });
                                }}>
                                <Text
                                  fontSize={12}
                                  fontWeight={600}
                                  color={'#3D52E6'}
                                  marginLeft={'8px'}>
                                  {t('copy')}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </HStack>
                        </HStack>
                      </Box>
                    ),
                  )}
                  <Box
                    paddingY={'16px'}
                    borderBottomColor={'#E8ECF3'}
                    borderBottomWidth={1}
                    borderBottomStyle={'solid'}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('HowToPay')}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <HStack alignItems={'center'}>
                        <IconInfo color={'#3D52E6'} />
                        <Text
                          fontWeight={600}
                          fontSize={12}
                          paddingLeft={'6px'}
                          color={'#3D52E6'}>
                          How to Pay
                        </Text>
                      </HStack>
                      <ChevronRightIcon color={'#3D52E6'} />
                    </TouchableOpacity>
                  </Box>
                </>
              ) : (
                <Box alignItems={'center'} marginTop={'12px'}>
                  <IconCircleCheck size={'95px'} />
                  <Text
                    color="#000000"
                    fontSize={16}
                    fontWeight={600}
                    marginTop={'20px'}
                    marginBottom={'8px'}>
                    Congratulation
                  </Text>
                  <Text
                    fontWeight={400}
                    color="#768499"
                    fontSize={11}
                    textAlign={'center'}>
                    {`Payment success. Don't forget to attend “${detailTransaction?.linked?.trnsEventId?.[0]?.evnhName}”. See you there!`}
                  </Text>
                </Box>
              )}
              <Button
                onPress={() =>
                  detailTransaction?.data?.trnsConfirmed === 0
                    ? fetchList()
                    : navigation.navigate('Main', {screen: t('tab.myEvents')})
                }
                width={'100%'}
                marginX={'22px'}
                marginTop={'20px'}
                paddingY={'12px'}
                borderRadius={8}
                alignSelf={'center'}
                bg={'#EB1C23'}>
                <Text
                  fontWeight={600}
                  color={colors.white}
                  fontSize={14}
                  textAlign={'center'}>
                  {detailTransaction?.data?.trnsConfirmed === 0
                    ? t('payment.checkPaymentStatus')
                    : t('myEvent.checkMyEvent')}
                </Text>
              </Button>
              <Text
                fontWeight={400}
                marginTop={'14px'}
                marginBottom={'12px'}
                color="#3F4C5F"
                fontSize={10}
                textAlign={'center'}>
                {t('payment.haveQuestion')}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('HowToPay')}>
                <Text
                  fontWeight={600}
                  marginBottom={'15px'}
                  color="#1E1E1E"
                  fontSize={12}
                  textDecorationLine={'underline'}
                  textAlign={'center'}>
                  {t('payment.seeTutorial')}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </>
      )}
    </AppContainer>
  );
}
