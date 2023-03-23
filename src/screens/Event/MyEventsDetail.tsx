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
import AppButton from '../../components/buttons/Button';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Header from '../../components/header/Header';
import IconInfo from '../../assets/icons/IconInfo';
import IconQr from '../../assets/icons/IconQr';
import {EventService} from '../../api/event.service';
import {getErrorMessage} from '../../helpers/errorHandler';
import moment from 'moment';
import datetime from '../../helpers/datetime';
import {EVENT_TYPES, GetEventResponse} from '../../types/event.type';
import LoadingBlock from '../../components/loading/LoadingBlock';
import {Dimensions, TextInput, TouchableOpacity} from 'react-native';
import {SvgXml} from 'react-native-svg';
import httpRequest from '../../helpers/httpRequest';
import AppContainer from '../../layout/AppContainer';
import {t} from 'i18next';
import {TransactionDetail} from '../../types/transaction.type';

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
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [isLoadingApplyCoupon, setIsLoadingApplyCoupon] =
    useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);

  const confirmRef = React.useRef(null);

  const [detailTransaction, setDetailTransaction] = useState<TransactionDetail>();
  const [detailEvent, setDetailEvent] = useState<GetEventResponse>();

  const [status, setStatus] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [QR, setQR] = useState<any>();

  const [tmpPayment, setTmpPayment] = useState<any>();
  const [confirmPayment, setConfirmPayment] = useState<any>();

  const [registeredEvent, setRegisteredEvent] = useState<any>();

  const checkStatus = async () => {
    let status;
    if (params.isBallot) {
      if (params.regStatus === 0) {
        status = 'Registered';
      } else if (params.regStatus === 99) {
        status = 'Unqualified';
      } else {
        if (detailTransaction?.data?.trnsConfirmed === 1) {
          status = 'Paid';
        } else if (
          moment(detailTransaction?.data?.trnsExpiredTime).isBefore(
            moment(new Date()),
          )
        ) {
          status = 'Payment Expired';
        } else {
          status = 'Waiting Payment';
        }
      }
    } else {
      if (detailTransaction?.data?.trnsConfirmed === 1) {
        status = 'Paid';
      } else if (
        moment(detailTransaction?.data?.trnsExpiredTime).isBefore(
          moment(new Date()),
        )
      ) {
        status = 'Payment Expired';
      } else {
        status = 'Waiting Payment';
      }
    }
    if (status === 'Paid') {
      const resQR = await EventService.generateQR(
        detailTransaction?.data?.trnsRefId +
          '%' +
          detailTransaction?.linked?.evrlTrnsId?.[0]?.evpaBIBNo,
      );
      console.log(resQR);

      if (resQR) {
        setQR(resQR);
      }
    }
    setStatus(status);
  };

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
      }

      const resDetailEvent = await EventService.getEvent(params.eventId);
      console.info('res detail event', JSON.stringify(resDetailEvent));
      if (resDetailEvent && resDetailEvent) {
        setDetailEvent(resDetailEvent);
      }

      httpRequest
        .get('member_resource/transaction')
        .then(resTransaction => {
          if (resTransaction.data) {
            const findEventRegister =
              resTransaction.data?.linked?.mregTrnsId?.find(
                (item: any) =>
                  item.trnsEventId?.toString() === params.eventId?.toString() &&
                  (item.trnsConfirmed === '1' ||
                    new Date(item.trnsExpiredTime)?.getTime() >
                      new Date().getTime(),
                  params?.isBallot),
              );

            if (findEventRegister) {
              const registeredEvent = resTransaction?.data?.data?.find(
                (item: any) => item.mregOrderId === findEventRegister.trnsRefId,
              );
              if (registeredEvent) {
                setRegisteredEvent(registeredEvent);
              }
            }
          }
        })
        .catch(err => {
          console.info('error check registered event', err);
        });
    } catch (error) {
      console.info('Error to fetch data', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [detailTransaction]);

  useEffect(() => {
    fetchData();
  }, [IsFocused]);

  const DATA_LIST = [
    {
      title: t('event.registrationDate'),
      value: datetime.getDateRangeString(
        detailEvent?.data?.evnhRegistrationStart,
        detailEvent?.data?.evnhRegistrationEnd,
        'short',
        'short',
      ),
    },
    {
      title: t('event.runningDate'),
      value: datetime.getDateRangeString(
        detailEvent?.data?.evnhStartDate,
        detailEvent?.data?.evnhEndDate,
        'short',
        'short',
      ),
    },
    {
      title: t('event.place'),
      value: detailEvent?.data?.evnhPlace || '-',
    },
    {
      title: t('event.totalPayment'),
      value: `IDR ${Number(
        detailTransaction?.data?.trnsAmount || 0,
      )?.toLocaleString('id-ID')}`,
    },
  ];

  function statusColor(status: string) {
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
    const color = statusColor(status || '');

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
      Toast.show({
        title: 'Failed to Apply Coupon',
        description: getErrorMessage(err),
      });
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
      Toast.show({
        title: 'Failed to pay now',
        description: getErrorMessage(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContainer>
      <Header title="Detail Event" left="back" />
      {isLoading ? (
        <LoadingBlock />
      ) : (
        <ScrollView backgroundColor={'#E8ECF3'}>
          {status !== 'Paid' && (
            <Box m={15} p={'10px'} borderRadius={5} bg={'#FFF8E4'}>
              <HStack>
                <IconInfo color={colors.black} size={6} />
                <VStack flex={1} paddingLeft={'10px'}>
                  <Text fontWeight={400} color="#201D1D" fontSize={12}>
                    {status === 'Payment Expired'
                      ? 'Status pembayaran sudah expired, jika masih ingin mengikuti event ini silahkan register ulang event ini'
                      : params.isBallot && status === 'Waiting Payment'
                      ? 'Selamat anda lolos tahap ballot, silahkan lanjutkan ke pembayaran event.'
                      : !params.isBallot && status === 'Waiting Payment'
                      ? 'Silahkan selesaikan pembayaran anda sebelum batas pembayaran berakhir'
                      : 'Pengumuman hasil ballot akan diinformasikan pada periode pengumuman hasil ballot.'}
                  </Text>
                  {(status === 'Registered' || status === 'Unqualified') && (
                    <Text
                      fontWeight={600}
                      color="#201D1D"
                      fontSize={12}
                      textDecorationLine={'underline'}>
                      Lihat detail info
                    </Text>
                  )}
                </VStack>
              </HStack>
            </Box>
          )}

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
              {status === 'Paid' && (
                <Box alignItems={'center'}>
                  <SvgXml xml={QR} />
                </Box>
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
                      ? 'Payment Expired'
                      : status === 'Waiting Payment'
                      ? 'Menunggu pembayaran'
                      : status === 'Registered'
                      ? 'Menunggu hasil ballot'
                      : 'Maaf anda tidak lolos tahap ballot'}
                  </Text>
                </>
              )}
              <Text
                fontWeight={400}
                color="#768499"
                fontSize={12}
                textAlign={'center'}>
                {status === 'Payment Expired'
                  ? 'Status pembayaran anda sudah expire'
                  : status === 'Paid'
                  ? 'Use this QR Code to enter the event'
                  : `QR Code event akan tampil disini setalah anda ${
                      params.isBallot ? 'lolos ballot & ' : ''
                    }melakukan pembayaran`}
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
                    {`Pay before ${moment(
                      detailTransaction?.data?.trnsExpiredTime,
                    ).format('DD MMM YYYY, HH:mm')}`}
                  </Text>
                </Box>
              )}

              {(status === 'Waiting Payment' ||
                (status === 'Payment Expired' && !params.isBallot)) && (
                <AppButton
                  onPress={() => {
                    setIsLoadingButton(true);
                    status === 'Waiting Payment'
                      ? confirmPayment
                        ? detailTransaction?.linked?.trihTrnsId?.length !== 0 &&
                          detailTransaction?.linked?.trihTrnsId?.find(
                            (item: any) => item.trihIsCurrent === 1,
                          )?.trihPaymentType === confirmPayment?.evptMsptName
                          ? navigation.navigate('Payment', {
                              transactionId: params.transactionId,
                            })
                          : handlePayNow()
                        : setShowModal(true)
                      : detailEvent && !registeredEvent
                      ? navigation.navigate('EventRegister', {
                          event: detailEvent,
                          selectedCategoryId:
                            detailTransaction?.linked?.evrlTrnsId?.[0]
                              ?.evpaEvncId || '',
                        })
                      : navigation.navigate('MyEventsDetail', {
                          transactionId: registeredEvent.mregOrderId,
                          eventId: registeredEvent.links?.mregEventId,
                          isBallot:
                            registeredEvent.mregType === 'MB' ? true : false,
                          regStatus: registeredEvent.mregStatus,
                        });
                    setConfirmPayment(undefined);
                    setIsLoadingButton(false);
                  }}
                  isLoading={isLoadingButton}
                  style={{marginTop: 12, marginHorizontal: 22}}
                  // width={'100%'}
                  // marginX={'22px'}
                  // marginTop={'12px'}
                  // paddingY={'12px'}
                  // borderRadius={8}
                  // alignSelf={'center'}
                  // bg={'#EB1C23'}
                >
                  <Text
                    fontWeight={500}
                    color={colors.white}
                    fontSize={14}
                    textAlign={'center'}>
                    {status === 'Waiting Payment'
                      ? confirmPayment
                        ? `Pay Now via ${confirmPayment?.evptLabel}`
                        : 'Choose Payment Method'
                      : 'Register Ulang Event'}
                  </Text>
                </AppButton>
              )}

              <Box
                marginTop={'15px'}
                paddingY={'16px'}
                borderTopColor={'#E8ECF3'}
                borderTopWidth={1}
                borderTopStyle={'solid'}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EventDetail', {
                      id: Number(detailEvent?.data.evnhId),
                    })
                  }>
                  <HStack
                    justifyContent={'space-between'}
                    alignItems={'center'}>
                    <VStack>
                      <Text fontWeight={500} color="#768499" fontSize={12}>
                        {(detailEvent?.data?.evnhType
                          ? EVENT_TYPES[detailEvent?.data?.evnhType as any]
                              .value || 'OTHER'
                          : 'OTHER'
                        ).toUpperCase()}
                      </Text>
                      <Text
                        fontWeight={500}
                        color="#1E1E1E"
                        fontSize={14}
                        numberOfLines={1}>
                        {detailEvent?.data?.evnhName}
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
                  <HStack justifyContent={'space-between'}>
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
            Punya pertanyaan seputar pembayaran event?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('HowToPay')}>
            <Text
              fontWeight={600}
              marginBottom={'15px'}
              color="#1E1E1E"
              fontSize={12}
              textDecorationLine={'underline'}
              textAlign={'center'}>
              Lihat panduan
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
            Choose Payment Method
          </Text>
          <Text color={'#768499'} fontSize={'12px'} fontWeight={400}>
            Silahkan pilih metode pembayarn untuk event ini
          </Text>
          <ScrollView
            flexGrow={1}
            width={'full'}
            height={screenWidth / 1.4}
            showsVerticalScrollIndicator={false}>
            {detailEvent &&
              detailEvent?.payments
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
          <AlertDialog.Header>Confirm Payment</AlertDialog.Header>
          <AlertDialog.Body marginY={'20px'}>
            <Text
              textAlign={'center'}
              fontSize={'16px'}
              fontWeight={600}
              marginBottom={'12px'}>
              {`Are you sure want to use ${tmpPayment?.evptLabel} as your Payment method?`}
            </Text>
            <Text
              textAlign={'center'}
              color={'#768499'}
              fontSize={'11px'}
              fontWeight={400}>
              You can’t change payment method after confirming your choice.
            </Text>
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
                  Cancel
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
                Yes, Sure
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </AppContainer>
  );
}
