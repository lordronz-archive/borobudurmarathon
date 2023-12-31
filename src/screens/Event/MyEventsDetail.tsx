import React, {useEffect, useMemo, useState} from 'react';
import {
  Box,
  useTheme,
  ScrollView,
  View,
  HStack,
  Text,
  VStack,
  ChevronRightIcon,
  Button,
  Toast,
  Badge,
  Divider,
} from 'native-base';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Header from '../../components/header/Header';
import IconQr from '../../assets/icons/IconQr';
import {EventService} from '../../api/event.service';
import {getErrorMessage} from '../../helpers/errorHandler';
import moment from 'moment';
import datetime from '../../helpers/datetime';
import {GetEventResponse, TransactionStatus} from '../../types/event.type';
import LoadingBlock from '../../components/loading/LoadingBlock';
import {TextInput, TouchableOpacity} from 'react-native';
import AppContainer from '../../layout/AppContainer';
import {t} from 'i18next';
import {TransactionDetail} from '../../types/transaction.type';
import {handleErrorMessage} from '../../helpers/apiErrors';
import TransactionAlertStatus from './components/TransactionAlertStatus';
import QRCodeWithFunction from './components/QRCodeWithFunction';
import ButtonBasedOnStatus from './components/ButtonBasedOnStatus';
import {getTransactionStatus} from '../../helpers/transaction';
import {convertDateTimeToLocalTimezone} from '../../helpers/datetimeTimezone';
import {getEventTypeName} from '../../helpers/event';
import Clipboard from '@react-native-clipboard/clipboard';
import useReviewInApp from '../../hooks/useReviewInApp';

export default function MyEventDetail() {
  const route = useRoute();
  const IsFocused = useIsFocused();
  const params = route.params as RootStackParamList['MyEventsDetail'];
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  const {initReviewInApp} = useReviewInApp();
  // const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState<boolean>(false);
  const [isLoadingApplyCoupon, setIsLoadingApplyCoupon] =
    useState<boolean>(false);

  const [detailTransaction, setDetailTransaction] =
    useState<TransactionDetail>();
  const [resEvent, setResEvent] = useState<GetEventResponse>();
  // const [eventDetail, setEventDetail] = useState<GetEventResponse>();
  // const eventData = eventDetail?.data;
  // console.info('eventDetail', JSON.stringify(eventDetail));

  const [status, setStatus] = useState<TransactionStatus>();
  const [couponCode, setCouponCode] = useState<string>('');

  // const [registeredEvent, setRegisteredEvent] = useState<any>();

  const isBallot =
    Number(detailTransaction?.linked.trnsEventId?.[0]?.evnhBallot) === 1;
  // const isBallot = detailTransaction?.linked.mregTrnsId?.[0]?.mregType === 'MB';
  console.log('isBallot', isBallot);
  console.log('mregType', detailTransaction?.linked.mregTrnsId?.[0]?.mregType);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      let resDetailTransaction = await EventService.getTransactionDetail(
        params.transactionId,
      );
      console.info(
        'res detail transaction',
        JSON.stringify(resDetailTransaction),
      );

      if (
        resDetailTransaction?.data?.data?.trnsAmount === '0' &&
        resDetailTransaction?.data?.data?.trnsConfirmed === 0
      ) {
        const resPayNow = await EventService.checkoutTransaction({
          transactionId: resDetailTransaction?.data?.data?.trnsId,
          paymentType: 9,
        });
        console.info('res pay now', JSON.stringify(resPayNow));
        if (resPayNow && resPayNow.data) {
          resDetailTransaction.data.data.trnsConfirmed = 1;
        }
      }

      let eventId;
      if (
        resDetailTransaction.data.linked &&
        resDetailTransaction.data.linked.trnsEventId &&
        resDetailTransaction.data.linked.trnsEventId[0].evnhId
      ) {
        eventId = resDetailTransaction.data.linked.trnsEventId[0].evnhId;
        fetchEvent(eventId);
      } else {
        Toast.show({
          description: 'Event id not found',
        });
        navigation.goBack();
      }

      if (resDetailTransaction && resDetailTransaction.data) {
        // resDetailTransaction.data.data.trnsExpiredTime = '2023-04-19 16:00:00'; // WIB
        setDetailTransaction(resDetailTransaction.data);

        const isThisBallot =
          Number(
            resDetailTransaction?.data?.linked.trnsEventId?.[0]?.evnhBallot,
          ) === 1;

        const regStatus = Number(
          resDetailTransaction?.data?.linked.mregTrnsId?.[0]?.mregStatus,
        );

        const newStatus: TransactionStatus = getTransactionStatus({
          isBallot: isThisBallot,
          regStatus,
          trnsConfirmed: resDetailTransaction?.data?.data?.trnsConfirmed,
          trnsExpiredTime: resDetailTransaction?.data?.data?.trnsExpiredTime,
        });
        setStatus(newStatus);

        if (newStatus === 'Paid') {
          initReviewInApp(eventId);
        }

        // const eventId =
        //   resDetailTransaction?.data?.linked?.trnsEventId?.[0]?.evnhId;

        // if (eventId && newStatus === 'Payment Expired' && !isBallot) {
        //   fetchDetailEvent(eventId);
        // }
      }
    } catch (error) {
      console.info('Error to fetch data', getErrorMessage(error));
      handleErrorMessage(error, t('error.failedToGetTransaction'), {
        on404: () => {
          navigation.goBack();
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvent = async (eventId: number) => {
    try {
      setIsLoadingEvent(true);
      const res = await EventService.getEvent(eventId);
      console.info('res fetch event', res);

      if (res) {
        setResEvent(res);
      }
    } catch (err) {
      handleErrorMessage(err, t('error.failedToGetEvent'), {
        on404: () => {
          navigation.goBack();
        },
      });
    } finally {
      setIsLoadingEvent(false);
    }
  };

  useEffect(() => {
    if (IsFocused) {
      fetchData();
    }
  }, [IsFocused]);

  const DATA_LIST = [
    {
      title: t('event.registrationID'),
      value: detailTransaction?.data?.trnsRefId,
      action: 'copy',
      onPress: () => {
        if (detailTransaction?.data.trnsRefId) {
          Clipboard.setString(detailTransaction?.data.trnsRefId);
          Toast.show({
            description: 'Copied successfully',
          });
        }
      },
    },
    {
      title: 'BIB',
      value: detailTransaction?.linked?.evrlTrnsId?.[0]?.evpaBIBNo,
    },
    {
      title: t('event.registrationDate'),
      value: datetime.getDateString(
        detailTransaction?.data?.trnsCreatedTime,
        'short',
        'short',
      ),
    },
    {
      title: t('name'),
      value: detailTransaction?.data?.trnsUserName,
    },
    {
      title: t('event.category'),
      value: detailTransaction?.linked?.trndTrnsId?.[0]?.trndDescription || '-',
    },
    {
      title: t('event.totalPayment'),
      value: `IDR ${Number(
        detailTransaction?.data?.trnsAmount || 0,
      )?.toLocaleString('id-ID')}`,
    },
    {
      title: t('event.paymentTime'),
      value:
        detailTransaction?.data?.trnsConfirmed === 1 &&
        detailTransaction?.data?.trnsConfirmTime
          ? datetime.getDateString(
              detailTransaction?.data?.trnsConfirmTime,
              'short',
              'short',
            )
          : '-',
    },
  ].filter(item => item.value !== null && item.value !== undefined);

  function statusColor() {
    switch (status) {
      case 'Registered':
        return {
          bgColor: '#E7F3FC',
          color: '#3D52E6',
        };
      case 'Unqualified':
      case 'Payment Expired':
        return {
          bgColor: '#FDEBEB',
          color: '#EB1C23',
        };
      case 'Waiting Payment':
        return {
          bgColor: '#FFF8E4',
          color: '#A4660A',
        };
      case 'Paid':
        return {
          bgColor: '#DFF4E0',
          color: '#26A62C',
        };
      default:
        return {
          bgColor: ' #DFF4E0',
          color: '#26A62C',
        };
    }
  }

  const statusComp = useMemo(() => {
    const color = statusColor();

    return (
      <Text
        fontSize={12}
        fontWeight={600}
        paddingX={'10px'}
        paddingY={'4px'}
        borderRadius={3}
        bg={color.bgColor}
        color={color.color}>
        {status}
      </Text>
    );
  }, [status]);

  const handleApplyCoupon = async () => {
    setIsLoadingApplyCoupon(true);
    try {
      const resApplyCoupon = await EventService.applyCoupon({
        cupnCode: couponCode,
        trnsRefId: detailTransaction?.data?.trnsRefId || '',
      });
      console.info('res apply coupon', JSON.stringify(resApplyCoupon));
      if (resApplyCoupon) {
        Toast.show({
          title: t('message.successApplyCoupon'),
        });
      }
    } catch (err) {
      handleErrorMessage(err, t('error.failedToApplyCoupon'));
    } finally {
      await fetchData();
      setIsLoadingApplyCoupon(false);
    }
  };

  const handlePayNow = async (paymentType: string) => {
    // confirmPayment.evptMsptId;
    setIsLoading(true);

    try {
      const resPayNow = await EventService.checkoutTransaction({
        transactionId: detailTransaction?.data?.trnsId,
        paymentType,
      });
      console.info('res pay now', JSON.stringify(resPayNow));
      if (resPayNow && resPayNow.data) {
        navigation.navigate('Payment', {
          transactionId: params.transactionId,
        });
      }
    } catch (err) {
      handleErrorMessage(err, t('error.failedToPayNow'));
    } finally {
      setIsLoading(false);
    }
  };

  let isShowButtonBasedOnStatus = false;
  if (['Waiting Payment', 'Payment Expired'].includes(status ?? '')) {
    isShowButtonBasedOnStatus = true;
  }

  let isShowButtonBasedOnStatusPaymentSpecial = false;
  if (
    ['Waiting Payment', 'Payment Expired', 'Registered'].includes(
      status ?? '',
    ) &&
    (resEvent?.payments_special || []).length > 0
  ) {
    isShowButtonBasedOnStatusPaymentSpecial = true;
  }
  // if (
  //   isBallot &&
  //   ['Waiting Payment', 'Payment Expired', 'Registered'].includes(
  //     status ?? '',
  //   ) &&
  //   ((resEvent?.payments_special || []).length > 0 ||
  //     (resEvent?.payments || []).length > 0)
  // ) {
  //   isShowButtonBasedOnStatus = true;
  // } else if (
  //   !isBallot &&
  //   ['Waiting Payment', 'Payment Expired', 'Registered'].includes(status ?? '')
  // ) {
  //   isShowButtonBasedOnStatus = true;
  // }

  return (
    <AppContainer>
      <Header title={t('myEvent.detailTitle')} left="back" />
      {isLoading || isLoadingEvent ? (
        <LoadingBlock
          style={{opacity: 0.7}}
          text={
            isLoading
              ? 'Loading Transaction...'
              : isLoadingEvent
              ? 'Loading Event...'
              : ''
          }
        />
      ) : (
        <ScrollView backgroundColor={'#E8ECF3'}>
          <TransactionAlertStatus isBallot={isBallot} status={status} />

          <Box margin={'15px'} bg={colors.white} borderRadius={8}>
            <VStack paddingX={'15px'}>
              <HStack
                justifyContent={'space-between'}
                marginBottom={'16px'}
                paddingY={'10px'}
                borderBottomColor={'#E8ECF3'}
                borderBottomWidth={1}
                borderBottomStyle={'solid'}>
                <Text fontWeight={400} color="#3F4C5F" fontSize={11}>
                  Status
                </Text>
                {statusComp}
              </HStack>

              {status === 'Paid' &&
              detailTransaction?.data?.trnsRefId &&
              detailTransaction?.linked?.evrlTrnsId?.[0]?.evpaBIBNo ? (
                <QRCodeWithFunction
                  trnsRefId={detailTransaction?.data?.trnsRefId}
                  evpaBIBNo={
                    detailTransaction?.linked?.evrlTrnsId?.[0]?.evpaBIBNo
                  }
                />
              ) : (
                false
              )}

              {status !== 'Paid' && (
                <>
                  <Box
                    width={44}
                    h={44}
                    borderRadius={8}
                    alignSelf={'center'}
                    bg={'#E8ECF3'}
                    p={'14px'}>
                    <IconQr />
                  </Box>
                  <Text
                    fontWeight={600}
                    marginY={'12px'}
                    color="#201D1D"
                    fontSize={16}
                    textAlign={'center'}>
                    {status === 'Payment Expired'
                      ? t('payment.paymentExpired')
                      : status === 'Waiting Payment'
                      ? t('payment.waitingPayment')
                      : status === 'Registered'
                      ? t('payment.waitingBallotResult')
                      : t('payment.sorryNotPassedBallot')}
                  </Text>
                </>
              )}
              <Text
                fontWeight={400}
                color="#768499"
                fontSize={12}
                textAlign={'center'}>
                {status === 'Payment Expired'
                  ? t('payment.paymentStatusExpiredShort')
                  : status === 'Paid'
                  ? 'Use this QR Code to enter the event'
                  : `${t('payment.qrWillAppear')} ${
                      isBallot ? `${t('payment.passedBallot')} & ` : ''
                    }${t('payment.makeAPayment')}`}
              </Text>
              {status === 'Waiting Payment' && (
                <Box
                  width={'100%'}
                  marginX={'22px'}
                  marginTop={'12px'}
                  paddingY={'12px'}
                  borderRadius={8}
                  alignSelf={'center'}
                  bg={'#F4F6F9'}>
                  <Text
                    fontWeight={500}
                    color="#201D1D"
                    fontSize={14}
                    textAlign={'center'}>
                    {`${t('payment.payBefore')} ${moment(
                      convertDateTimeToLocalTimezone(
                        detailTransaction?.data?.trnsExpiredTime,
                      ),
                    ).format('DD MMM YYYY, HH:mm')}`}
                  </Text>
                </Box>
              )}

              {isShowButtonBasedOnStatus ? (
                <ButtonBasedOnStatus
                  eventId={detailTransaction?.linked?.trnsEventId?.[0]?.evnhId}
                  transactionId={params.transactionId}
                  status={status}
                  // paymentMethodsSpecial={
                  //   resEvent?.payments_special || undefined
                  // }
                  isPaymentSpecial={false}
                  paymentMethods={resEvent?.payments || undefined}
                  activePayment={detailTransaction?.linked?.trihTrnsId?.find(
                    item => item.trihIsCurrent === 1,
                  )}
                  isBallot={isBallot}
                  evpaEvncId={
                    detailTransaction?.linked?.evrlTrnsId?.[0]?.evpaEvncId || ''
                  }
                  onPayNow={handlePayNow}
                />
              ) : (
                false
              )}

              {isShowButtonBasedOnStatusPaymentSpecial ? (
                <>
                  <Divider mt={3} />
                  <ButtonBasedOnStatus
                    eventId={
                      detailTransaction?.linked?.trnsEventId?.[0]?.evnhId
                    }
                    transactionId={params.transactionId}
                    status={status}
                    isPaymentSpecial={true}
                    paymentMethodsSpecial={
                      resEvent?.payments_special || undefined
                    }
                    // paymentMethods={resEvent?.payments || undefined}
                    activePayment={detailTransaction?.linked?.trihTrnsId?.find(
                      item => item.trihIsCurrent === 1,
                    )}
                    isBallot={isBallot}
                    evpaEvncId={
                      detailTransaction?.linked?.evrlTrnsId?.[0]?.evpaEvncId ||
                      ''
                    }
                    onPayNow={handlePayNow}
                  />
                </>
              ) : (
                false
              )}

              <Box
                marginTop={'15px'}
                paddingY={'16px'}
                borderTopColor={'#E8ECF3'}
                borderTopWidth={1}
                borderTopStyle={'solid'}>
                <TouchableOpacity
                  onPress={() => {
                    if (detailTransaction?.linked.trnsEventId?.[0]?.evnhId) {
                      navigation.navigate('EventDetail', {
                        id: detailTransaction?.linked.trnsEventId?.[0]?.evnhId,
                      });
                    }
                  }}>
                  <HStack
                    justifyContent={'space-between'}
                    alignItems={'center'}>
                    <VStack width="90%">
                      <Text fontWeight={500} color="#768499" fontSize={12}>
                        {detailTransaction?.linked?.mregTrnsId?.[0]
                          ?.mregTypeDesc ||
                          getEventTypeName({
                            evnhType:
                              detailTransaction?.linked?.trnsEventId?.[0]
                                ?.evnhType,
                            evnhBallot: isBallot ? 1 : 0,
                            mregTypeDesc:
                              detailTransaction?.linked?.mregTrnsId?.[0]
                                ?.mregTypeDesc,
                          })}
                      </Text>
                      <Text
                        fontWeight={500}
                        color="#1E1E1E"
                        fontSize={14}
                        numberOfLines={1}>
                        {/* {eventData?.evnhName} */}
                        {detailTransaction?.linked?.trnsEventId?.[0]?.evnhName}
                      </Text>
                    </VStack>
                    <ChevronRightIcon />
                  </HStack>
                </TouchableOpacity>
              </Box>

              {status === 'Waiting Payment' && (
                <Box
                  paddingY={'16px'}
                  borderTopColor={'#E8ECF3'}
                  borderTopWidth={1}
                  borderTopStyle={'solid'}>
                  <HStack
                    justifyContent={'space-between'}
                    alignItems={'center'}>
                    <Text fontWeight={400} color="#768499" fontSize={11}>
                      Coupon
                    </Text>
                    {detailTransaction?.linked?.trcpTrnsId &&
                    detailTransaction?.linked?.trcpTrnsId?.length !== 0 ? (
                      <Text fontWeight={500} color="#1E1E1E" fontSize={12}>
                        {
                          detailTransaction?.linked?.trcpTrnsId?.[0]
                            ?.trcpCupnCode
                        }
                      </Text>
                    ) : (
                      <HStack alignItems={'center'}>
                        <TextInput
                          onChangeText={val => setCouponCode(val)}
                          value={couponCode}
                          style={{
                            color: '#1E1E1E',
                            borderWidth: 1,
                            borderStyle: 'solid',
                            borderColor: '#C5CDDB',
                            borderRadius: 3,
                            width: 150,
                            height: 40,
                            paddingHorizontal: 10,
                          }}
                        />
                        <Button
                          isLoading={isLoadingApplyCoupon}
                          onPress={handleApplyCoupon}
                          marginLeft={'10px'}>
                          Apply
                        </Button>
                      </HStack>
                    )}
                  </HStack>
                </Box>
              )}
              {DATA_LIST.map(
                item =>
                  (item.title !== t('event.paymentTime') ||
                    detailTransaction?.data?.trnsConfirmed === 1) && (
                    <Box
                      key={item.title}
                      paddingY={'16px'}
                      borderTopColor={'#E8ECF3'}
                      borderTopWidth={1}
                      borderTopStyle={'solid'}>
                      <HStack
                        justifyContent={'space-between'}
                        alignItems="center">
                        <Text
                          fontWeight={400}
                          color="#768499"
                          fontSize={11}
                          width="35%">
                          {item.title}
                        </Text>
                        {item.action === 'copy' ? (
                          <TouchableOpacity
                            style={{
                              width: '60%',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                            }}
                            onPress={item.onPress}>
                            <Text
                              fontWeight={500}
                              fontSize={12}
                              textAlign="right"
                              mr={3}>
                              {item.value}
                            </Text>
                            <Badge
                              colorScheme="warning"
                              alignSelf="center"
                              variant="subtle"
                              fontSize={9}>
                              copy
                            </Badge>
                          </TouchableOpacity>
                        ) : (
                          <Text
                            fontWeight={500}
                            color="#1E1E1E"
                            fontSize={12}
                            textAlign="right">
                            {item.value}
                          </Text>
                        )}
                      </HStack>
                    </Box>
                  ),
              )}

              {true && (
                <Box
                  paddingY={'16px'}
                  borderTopColor={'#E8ECF3'}
                  borderTopWidth={1}
                  borderTopStyle={'solid'}>
                  <HStack justifyContent={'space-between'} alignItems="center">
                    <Text
                      fontWeight={400}
                      color="#768499"
                      fontSize={11}
                      width="35%">
                      {t('event.expiredTime')}
                    </Text>
                    <Text
                      fontWeight={500}
                      color="#1E1E1E"
                      fontSize={12}
                      width="60%"
                      textAlign="right">
                      {detailTransaction?.data?.trnsExpiredTime
                        ? moment(
                            convertDateTimeToLocalTimezone(
                              detailTransaction?.data?.trnsExpiredTime,
                            ),
                          ).format('DD MMM YYYY, HH:mm')
                        : '-'}
                    </Text>
                  </HStack>
                </Box>
              )}

              {/* <RowDetailRegistration
              data={detailTransaction?.linked.evrlTrnsId?.[0] || {}}
              evnhId={detailTransaction?.linked.trnsEventId?.[0]?.evnhId || 0}
            /> */}
            </VStack>
            <HStack>
              <View flex={1} bg={'#EB1C23'} height={'6px'} />
              <View flex={1} bg={'#3D52E6'} height={'6px'} />
              <View flex={1} bg={'#DFB344'} height={'6px'} />
            </HStack>
          </Box>

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
    </AppContainer>
  );
}
