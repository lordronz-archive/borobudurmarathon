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
  Modal,
  Pressable,
  Radio,
} from 'native-base';
import {useNavigation, useRoute} from '@react-navigation/native';
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
import {TouchableOpacity} from 'react-native';
import {SvgXml} from 'react-native-svg';

export default function MyEventDetail() {
  const route = useRoute();
  const params = route.params as RootStackParamList['MyEventsDetail'];
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  // const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [showModal, setShowModal] = useState<boolean>(false);

  const [detailTransaction, setDetailTransaction] = useState<any>();
  const [detailEvent, setDetailEvent] = useState<GetEventResponse>();

  const [status, setStatus] = useState<string>('');
  const [QR, setQR] = useState<any>();

  // const [selectedPayment, setSelectedPayment] = useState<any>();

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
      const resDetailTransaction = await EventService.getTransactionDetail(
        params.transactionId,
      );
      console.info(
        'res detail transaction',
        JSON.stringify(resDetailTransaction),
      );
      if (resDetailTransaction && resDetailTransaction.data) {
        setDetailTransaction(resDetailTransaction.data);
      }

      const resDetailEvent = await EventService.getEvent(params.eventId);
      console.info('res detail event', JSON.stringify(resDetailEvent));
      if (resDetailEvent && resDetailEvent) {
        setDetailEvent(resDetailEvent);
      }
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
  }, []);

  const DATA_LIST = [
    {
      title: 'Registration Dates',
      value: datetime.getDateRangeString(
        detailEvent?.data?.evnhRegistrationStart,
        detailEvent?.data?.evnhRegistrationEnd,
        'short',
        'short',
      ),
    },
    {
      title: 'Running Dates',
      value: datetime.getDateRangeString(
        detailEvent?.data?.evnhStartDate,
        detailEvent?.data?.evnhEndDate,
        'short',
        'short',
      ),
    },
    {
      title: 'Location',
      value: detailEvent?.data?.evnhPlace || '-',
    },
    {
      title: 'Total Payment',
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

  const handlePayNow = async () => {
    setIsLoading(true);

    try {
      const resPayNow = await EventService.checkoutTransaction({
        transactionId: detailTransaction?.data?.trnsId,
        paymentType: '10',
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
    <View backgroundColor={colors.white} flex={1}>
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
                <Button
                  onPress={() =>
                    status === 'Waiting Payment'
                      ? handlePayNow()
                      : detailEvent &&
                        navigation.navigate('EventRegister', {
                          event: detailEvent,
                          selectedCategoryId:
                            detailTransaction?.linked?.evrlTrnsId?.[0]
                              ?.evpaEvncId,
                        })
                  }
                  width={'100%'}
                  marginX={'22px'}
                  marginTop={'12px'}
                  paddingY={'12px'}
                  borderRadius={8}
                  alignSelf={'center'}
                  bg={'#EB1C23'}>
                  <Text
                    fontWeight={500}
                    color={colors.white}
                    fontSize={14}
                    textAlign={'center'}>
                    {status === 'Waiting Payment'
                      ? 'Pay Now'
                      : 'Register Ulang Event'}
                  </Text>
                </Button>
              )}

              <Box
                marginTop={'15px'}
                paddingY={'16px'}
                borderTopColor={'#E8ECF3'}
                borderTopWidth={1}
                borderTopStyle={'solid'}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Main', {screen: 'My Events'})
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
                      <Text fontWeight={500} color="#1E1E1E" fontSize={14}>
                        {detailEvent?.data?.evnhName}
                      </Text>
                    </VStack>
                    <ChevronRightIcon />
                  </HStack>
                </TouchableOpacity>
              </Box>
              {DATA_LIST.map(item => (
                <Box
                  key={item.title}
                  paddingY={'16px'}
                  borderTopColor={'#E8ECF3'}
                  borderTopWidth={1}
                  borderTopStyle={'solid'}>
                  <HStack justifyContent={'space-between'}>
                    <Text fontWeight={400} color="#768499" fontSize={11}>
                      {item.title}
                    </Text>
                    <Text fontWeight={500} color="#1E1E1E" fontSize={12}>
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
          <Text
            fontWeight={600}
            marginBottom={'15px'}
            color="#1E1E1E"
            fontSize={12}
            textDecorationLine={'underline'}
            textAlign={'center'}>
            Lihat panduan
          </Text>
        </ScrollView>
      )}
      {/* <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Choose Payment</Modal.Header>
          <Modal.Body>
            <Radio.Group
              name="payment"
              size="sm"
              onChange={val => console.log(val)}>
              <VStack space={3}>
                {detailEvent &&
                  detailEvent?.payments?.map(item => (
                    <Radio
                      alignItems="flex-start"
                      value={item.evptMsptId}
                      colorScheme="red"
                      size="sm">
                      {item.evptLabel}
                    </Radio>
                  ))}
              </VStack>
            </Radio.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                onPress={() => {
                  setShowModal(false);
                }}>
                Cancel
              </Button>
              <Button
                disabled={selectedPayment}
                onPress={() => {
                  setShowModal(false);
                }}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal> */}
    </View>
  );
}
