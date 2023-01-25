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
  Image,
  Divider,
  Button,
  Toast,
  Pressable,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Header from '../../components/header/Header';
import IconInfo from '../../assets/icons/IconInfo';
import IconQr from '../../assets/icons/IconQr';
import {TouchableOpacity} from 'react-native';
import {EVENT_TYPES, EventProperties} from '../../types/event.type';
import {EventService} from '../../api/event.service';
import {getErrorMessage} from '../../helpers/errorHandler';
import datetime from '../../helpers/datetime';
import moment from 'moment';

export default function PaymentScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  const [isLoading, setIsLoading] = useState(false);
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
      title: 'Order at',
      value: `${moment(detailTransaction?.data?.data?.trnsCreatedTime).format(
        'DD MMM YYYY, HH:mm',
      )}`,
    },
    {
      title: 'Total Payment',
      value: `IDR ${Number(
        detailTransaction?.data?.data?.trnsAmount,
      )?.toLocaleString('id-ID')}`,
    },
  ];

  const DATA_PAYMENT = [
    {title: 'Payment Method', value: 'Bank Jateng Virtual Account'},
    {title: 'Total Payment', value: '113 - Bank Jateng'},
    {title: 'Virtual Account', value: ''},
  ];

  return (
    <View backgroundColor={colors.white} flex={1}>
      <Header title="" left="back" />
      <ScrollView backgroundColor={colors.white} marginX={15}>
        <HStack paddingY={'16px'}>
          <Image
            w="62px"
            h="62px"
            marginRight={'15px'}
            borderRadius={5}
            source={
              detailTransaction?.data?.linked?.trnsEventId?.[0]?.evnhThumbnail
                ? {
                    uri: detailTransaction?.data?.linked?.trnsEventId?.[0]
                      ?.evnhThumbnail,
                  }
                : require('../../assets/images/FeaturedEventImage.png')
            }
            alt="Event Thumbnail"
          />
          <VStack flex={1}>
            <Text fontSize={12} fontWeight={600} color={'#768499'}>
              {(detailTransaction?.data?.linked?.trnsEventId?.[0]?.evnhType
                ? EVENT_TYPES[
                    detailTransaction?.data?.linked?.trnsEventId?.[0]
                      ?.evnhType as any
                  ].value || 'OTHER'
                : 'OTHER'
              ).toUpperCase()}
            </Text>
            <Text fontSize={13} fontWeight={400} color={'#1E1E1E'}>
              {detailTransaction?.data?.linked?.trnsEventId?.[0]?.evnhName}
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
              Registration date
            </Text>
            <Text fontWeight={400} color="#1E1E1E" fontSize={12}>
              {datetime.getDateRangeString(
                detailTransaction?.data?.linked?.trnsEventId?.[0]
                  ?.evnhRegistrationStart,
                detailTransaction?.data?.linked?.trnsEventId?.[0]
                  ?.evnhRegistrationEnd,
                'short',
                'short',
              )}
            </Text>
          </VStack>
          <VStack width={'50%'}>
            <Text fontWeight={400} color="#768499" fontSize={10}>
              Running date
            </Text>
            <Text fontWeight={400} color="#1E1E1E" fontSize={12}>
              {datetime.getDateRangeString(
                detailTransaction?.data?.linked?.trnsEventId?.[0]
                  ?.evnhStartDate,
                detailTransaction?.data?.linked?.trnsEventId?.[0]?.evnhEndDate,
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
            Payment Information
          </Text>
          <Text fontWeight={400} fontSize={11} color={'#768499'}>
            To complete Event Registration please ensure you have paid
            registration fee.
          </Text>
        </VStack>
        <VStack>
          <Text
            fontWeight={600}
            fontSize={12}
            color={'#1E1E1E'}
            paddingY={'12px'}
            textAlign={'center'}>
            Complete your payment before
          </Text>
          <Box paddingY={'12px'} bg={'#F4F6F9'} borderRadius={5}>
            <Text
              fontWeight={500}
              fontSize={16}
              color={'#1E1E1E'}
              textAlign={'center'}>
              {`${moment(detailTransaction?.data?.data?.trnsExpiredTime).format(
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
        {DATA_PAYMENT.map(item => (
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
              {item.title === 'Virtual Account' && (
                <Pressable>
                  <Text fontSize={12} fontWeight={600} color={'#3D52E6'}>
                    Copy
                  </Text>
                </Pressable>
              )}
            </HStack>
          </Box>
        ))}
        <Box
          paddingY={'16px'}
          borderBottomColor={'#E8ECF3'}
          borderBottomWidth={1}
          borderBottomStyle={'solid'}>
          <TouchableOpacity
            onPress={() => navigation.navigate('HowToPay')}
            style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
            fontWeight={600}
            color={colors.white}
            fontSize={14}
            textAlign={'center'}>
            Check Payment Status
          </Text>
        </Button>
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
