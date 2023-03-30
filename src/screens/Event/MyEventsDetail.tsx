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
  Actionsheet,
  AlertDialog,
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
import {
  EVENT_TYPES,
  GetEventResponse,
  TransactionStatus,
} from '../../types/event.type';
import LoadingBlock from '../../components/loading/LoadingBlock';
import {Dimensions, TextInput, TouchableOpacity} from 'react-native';
import AppContainer from '../../layout/AppContainer';
import {t} from 'i18next';
import {TransactionDetail} from '../../types/transaction.type';
import {handleErrorMessage} from '../../helpers/apiErrors';
import TransactionAlertStatus from './components/TransactionAlertStatus';
import QRCodeWithFunction from './components/QRCodeWithFunction';
import ButtonBasedOnStatus from './components/ButtonBasedOnStatus';
import {getTransactionStatus} from '../../helpers/transaction';

export default function MyEventDetail() {
  const route = useRoute();
  const IsFocused = useIsFocused();
  const params = route.params as RootStackParamList['MyEventsDetail'];
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  const screenWidth = Dimensions.get('window').width;
  // const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState<boolean>(false);
  const [isLoadingApplyCoupon, setIsLoadingApplyCoupon] =
    useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);

  const confirmRef = React.useRef(null);

  const [detailTransaction, setDetailTransaction] =
    useState<TransactionDetail>();
  const [eventDetail, setEventDetail] = useState<GetEventResponse>();
  const eventData = eventDetail?.data;
  console.info('eventDetail', JSON.stringify(eventDetail));

  const [status, setStatus] = useState<TransactionStatus>();
  const [couponCode, setCouponCode] = useState<string>('');

  const [tmpPayment, setTmpPayment] = useState<any>();
  const [confirmPayment, setConfirmPayment] = useState<any>();

  // const [registeredEvent, setRegisteredEvent] = useState<any>();

  const isBallot =
    Number(detailTransaction?.linked.trnsEventId?.[0]?.evnhBallot) === 1;

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

      if (resDetailTransaction && resDetailTransaction.data) {
        setDetailTransaction(resDetailTransaction.data);

        const isThisBallot =
          Number(
            resDetailTransaction?.data?.linked.trnsEventId?.[0]?.evnhBallot,
          ) === 1;
        const regStatus = resDetailTransaction?.data?.data.trnsStatus;

        let newStatus: TransactionStatus = getTransactionStatus({
          isBallot: isThisBallot,
          regStatus,
          trnsConfirmed: resDetailTransaction?.data?.data?.trnsConfirmed,
          trnsExpiredTime: resDetailTransaction?.data?.data?.trnsExpiredTime,
        });
        setStatus(newStatus);

        const eventId =
          resDetailTransaction?.data?.linked?.trnsEventId?.[0]?.evnhId;

        if (eventId) {
          fetchDetailEvent(eventId);
        }
      }
    } catch (error) {
      console.info('Error to fetch data', getErrorMessage(error));
      handleErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetailEvent = async (eventId: number) => {
    setIsLoadingEvent(true);
    EventService.getEvent(eventId)
      .then(resEvent => {
        console.info('res get detail event', JSON.stringify(resEvent));
        setEventDetail(resEvent);
        setIsLoadingEvent(false);
      })
      .catch(err => {
        console.info('err get event detail', JSON.stringify(err));
        handleErrorMessage(err, t('error.failedToGetEvent'));
        setIsLoadingEvent(false);
      });
  };

  useEffect(() => {
    if (detailTransaction && eventDetail) {
      if (detailTransaction?.linked?.trihTrnsId?.length !== 0) {
        const currentPayment = detailTransaction?.linked?.trihTrnsId?.find(
          item => item.trihIsCurrent === 1,
        );
        if (currentPayment) {
          const findPayment = eventDetail.payments?.find(
            item => item.evptMsptName === currentPayment.trihPaymentType,
          );
          setConfirmPayment(findPayment);
        }
      }
    }
  }, [detailTransaction, eventDetail]);

  useEffect(() => {
    fetchData();
  }, [IsFocused]);

  const DATA_LIST = [
    {
      title: 'Registration ID',
      value: detailTransaction?.data?.trnsRefId,
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
      title: t('event.runningDate'),
      value: datetime.getDateRangeString(
        detailTransaction?.linked?.trnsEventId?.[0]?.evnhStartDate,
        detailTransaction?.linked?.trnsEventId?.[0]?.evnhEndDate,
        'short',
        'short',
      ),
    },
    {
      title: t('event.place'),
      value: detailTransaction?.linked?.trnsEventId?.[0]?.evnhPlace || '-',
    },
    {
      title: t('event.totalPayment'),
      value: `IDR ${Number(
        detailTransaction?.data?.trnsAmount || 0,
      )?.toLocaleString('id-ID')}`,
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
          title: 'Success to Apply Coupon',
        });
      }
    } catch (err) {
      handleErrorMessage(err, t('error.failedToApplyCoupon'));
    } finally {
      await fetchData();
      setIsLoadingApplyCoupon(false);
    }
  };

  const handlePayNow = async () => {
    setIsLoading(true);

    try {
      const resPayNow = await EventService.checkoutTransaction({
        transactionId: detailTransaction?.data?.trnsId,
        paymentType: confirmPayment.evptMsptId,
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

  return (
    <AppContainer>
      <Header title={t('myEvent.detailTitle')} left="back" />
      {isLoading || isLoadingEvent ? (
        <LoadingBlock style={{opacity: 0.7}} />
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
                      detailTransaction?.data?.trnsExpiredTime,
                    ).format('DD MMM YYYY, HH:mm')}`}
                  </Text>
                </Box>
              )}

              <ButtonBasedOnStatus
                transactionId={params.transactionId}
                status={status}
                payment={confirmPayment}
                isBallot={isBallot}
                eventDetail={eventDetail}
                evpaEvncId={
                  detailTransaction?.linked?.evrlTrnsId?.[0]?.evpaEvncId || ''
                }
                onChoosePaymentMethod={() => setShowModal(true)}
                onPayNow={() => handlePayNow()}
                isPaymentGenerated={
                  detailTransaction?.linked?.trihTrnsId?.length !== 0 &&
                  detailTransaction?.linked?.trihTrnsId?.find(
                    (item: any) => item.trihIsCurrent === 1,
                  )?.trihPaymentType === confirmPayment?.evptMsptName
                }
                onAfterButtonFinished={() => {
                  setConfirmPayment(undefined);
                }}
              />

              <Box
                marginTop={'15px'}
                paddingY={'16px'}
                borderTopColor={'#E8ECF3'}
                borderTopWidth={1}
                borderTopStyle={'solid'}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EventDetail', {
                      id: Number(eventData?.evnhId),
                    })
                  }>
                  <HStack
                    justifyContent={'space-between'}
                    alignItems={'center'}>
                    <VStack width="90%">
                      <Text fontWeight={500} color="#768499" fontSize={12}>
                        {(eventData?.evnhType
                          ? EVENT_TYPES[eventData?.evnhType as any].value ||
                            'OTHER'
                          : 'OTHER'
                        ).toUpperCase() + (isBallot ? ' (BALLOT)' : '')}
                      </Text>
                      <Text
                        fontWeight={500}
                        color="#1E1E1E"
                        fontSize={14}
                        numberOfLines={1}>
                        {eventData?.evnhName}
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
              {DATA_LIST.map(item => (
                <Box
                  key={item.title}
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
                      {item.title}
                    </Text>
                    <Text
                      fontWeight={500}
                      color="#1E1E1E"
                      fontSize={12}
                      width="60%"
                      textAlign="right">
                      {item.value}
                    </Text>
                  </HStack>
                </Box>
              ))}
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

      <Actionsheet
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size={'full'}>
        <Actionsheet.Content maxWidth={'100%'}>
          <Text color={'#1E1E1E'} fontSize={'20px'} fontWeight={600}>
            {t('payment.choosePaymentMethod')}
          </Text>
          <Text color={'#768499'} fontSize={'12px'} fontWeight={400}>
            {t('payment.choosePaymentMethodDescription')}
          </Text>
          <ScrollView
            flexGrow={1}
            width={'full'}
            height={screenWidth / 1.4}
            showsVerticalScrollIndicator={false}>
            {eventDetail &&
              eventDetail?.payments
                ?.filter(item => item.evptMsptId !== '9')
                ?.sort((a, b) =>
                  a.evptLabel < b.evptLabel
                    ? -1
                    : a.evptLabel > b.evptLabel
                    ? 1
                    : 0,
                )
                ?.map(item => (
                  <Actionsheet.Item
                    key={item.evptMsptId}
                    onPress={() => {
                      setTmpPayment(item);
                      setShowModal(false);
                      setShowModalConfirm(true);
                    }}
                    color={'#1E1E1E'}
                    fontSize={'14px'}
                    fontWeight={400}>
                    {item.evptLabel}
                  </Actionsheet.Item>
                ))}
          </ScrollView>
        </Actionsheet.Content>
      </Actionsheet>

      <AlertDialog leastDestructiveRef={confirmRef} isOpen={showModalConfirm}>
        <AlertDialog.Content>
          <AlertDialog.Header>{t('payment.confirmPayment')}</AlertDialog.Header>
          <AlertDialog.Body marginY={'20px'}>
            <Text
              textAlign={'center'}
              fontSize={'16px'}
              fontWeight={600}
              marginBottom={'12px'}>
              {`Are you sure want to use ${tmpPayment?.evptLabel} as your Payment method?`}
            </Text>
            {/* <Text
              textAlign={'center'}
              color={'#768499'}
              fontSize={'11px'}
              fontWeight={400}>
              You can't change payment method after confirming your choice.
            </Text> */}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group width={'full'}>
              <Button
                flex={1}
                backgroundColor={'#fff'}
                borderColor={'#C5CDDB'}
                borderStyle={'solid'}
                borderWidth={1}
                borderRadius={'8px'}
                onPress={() => {
                  setShowModalConfirm(false);
                  setTmpPayment(undefined);
                  setShowModal(true);
                }}
                ref={confirmRef}>
                <Text fontSize={'14px'} fontWeight={400}>
                  {t('cancel')}
                </Text>
              </Button>
              <Button
                flex={1}
                borderRadius={'8px'}
                onPress={() => {
                  setConfirmPayment(tmpPayment);
                  setTmpPayment(undefined);
                  setShowModalConfirm(false);
                }}>
                {t('sure')}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </AppContainer>
  );
}
