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
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Header from '../../components/header/Header';
import IconInfo from '../../assets/icons/IconInfo';
import IconQr from '../../assets/icons/IconQr';
import {EventService} from '../../api/event.service';
import {getErrorMessage} from '../../helpers/errorHandler';
import moment from 'moment';
import datetime from '../../helpers/datetime';
import {EVENT_TYPES} from '../../types/event.type';

export default function MyEventDetail(id: string) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  // const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detailTransaction, setDetailTransaction] = useState<any>();

  const fetchList = () => {
    setIsLoading(true);
    EventService.getTransactionDetail('OMBAKCEA')
      .then(res => {
        console.info('res transaction', JSON.stringify(res));
        if (res) {
          setDetailTransaction(res);
        }
      })
      .catch(err => {
        Toast.show({
          title: 'Failed to get featured events',
          description: getErrorMessage(err),
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchList();
  }, []);

  const DATA_LIST = [
    {
      title: 'Registration Dates',
      value: datetime.getDateRangeString(
        detailTransaction?.data?.linked?.trnsEventId?.[0]
          ?.evnhRegistrationStart,
        detailTransaction?.data?.linked?.trnsEventId?.[0]?.evnhRegistrationEnd,
        'short',
        'short',
      ),
    },
    {
      title: 'Running Dates',
      value: datetime.getDateRangeString(
        detailTransaction?.data?.linked?.trnsEventId?.[0]?.evnhStartDate,
        detailTransaction?.data?.linked?.trnsEventId?.[0]?.evnhEndDate,
        'short',
        'short',
      ),
    },
    {
      title: 'Location',
      value:
        detailTransaction?.data?.linked?.trnsEventId?.[0]?.evnhPlace || '-',
    },
    {
      title: 'Total Payment',
      value: `IDR ${Number(
        detailTransaction?.data?.data?.trnsAmount,
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
          bgColor: ' #DFF4E0',
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
    let status;

    if (detailTransaction?.data?.trnsConfirmed === 1) {
      status = 'Paid';
    } else if (detailTransaction?.data?.trnsPaymentStatus === 1) {
      status = 'Waiting Payment';
    } else if (detailTransaction?.data?.trnsConfirmed === 0) {
      status = 'Paid';
    } else {
      status = 'Waiting Payment';
    }

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
  }, [detailTransaction?.data]);

  return (
    <View backgroundColor={colors.white} flex={1}>
      <Header title="Detail Event" left="back" />
      <ScrollView backgroundColor={'#E8ECF3'}>
        <Box m={15} p={'10px'} borderRadius={5} bg={'#FFF8E4'}>
          <HStack>
            <IconInfo color={colors.black} size={6} />
            <VStack flex={1} paddingLeft={'10px'}>
              <Text fontWeight={400} color="#201D1D" fontSize={12}>
                Pengumuman hasil ballot akan diinformasikan pada periode
                pengumuman hasil ballot.
              </Text>
              <Text
                fontWeight={600}
                color="#201D1D"
                fontSize={12}
                textDecorationLine={'underline'}>
                Lihat detail info
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box marginX={'15px'} bg={colors.white} borderRadius={8}>
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
              Status
            </Text>
            <Text
              fontWeight={400}
              color="#768499"
              fontSize={12}
              textAlign={'center'}>
              QR Code event akan tampil disini setalah anda lolos ballot &
              melakukan pembayaran
            </Text>
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
            <Button
              onPress={() => navigation.navigate('Payment')}
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
                Pay Now
              </Text>
            </Button>
            <Box
              marginTop={'15px'}
              paddingY={'16px'}
              borderTopColor={'#E8ECF3'}
              borderTopWidth={1}
              borderTopStyle={'solid'}>
              <HStack justifyContent={'space-between'} alignItems={'center'}>
                <VStack>
                  <Text fontWeight={500} color="#768499" fontSize={12}>
                    {(detailTransaction?.data?.linked?.trnsEventId?.[0]
                      ?.evnhType
                      ? EVENT_TYPES[
                          detailTransaction?.data?.linked?.trnsEventId?.[0]
                            ?.evnhType as any
                        ].value || 'OTHER'
                      : 'OTHER'
                    ).toUpperCase()}
                  </Text>
                  <Text fontWeight={500} color="#1E1E1E" fontSize={14}>
                    Bank Jateng Tilik Candi 2022
                  </Text>
                </VStack>
                <ChevronRightIcon />
              </HStack>
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
    </View>
  );
}
