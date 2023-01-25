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
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Header from '../../components/header/Header';
import IconInfo from '../../assets/icons/IconInfo';
import IconQr from '../../assets/icons/IconQr';
import {TouchableOpacity} from 'react-native';
import {EventProperties} from '../../types/event.type';
import {EventService} from '../../api/event.service';
import {getErrorMessage} from '../../helpers/errorHandler';

export default function PaymentScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [detailTransaction, setDetailTransaction] = useState<any>();

  const DATA_LIST = [
    {title: 'Order at', value: ''},
    {title: 'Total Payment', value: ''},
    {title: 'Payment Method', value: ''},
    {title: 'Total Payment', value: ''},
    {title: 'Virtual Account', value: ''},
  ];

  const [data, setData] = useState<any[]>([]);

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

  function statusColor(status: string) {
    switch (status) {
      case 'Free':
        return {
          bgColor: '#DAEFFA',
          color: '#2B9CDC',
        };
      case 'Cleared':
        return {
          bgColor: '#D7F4EB',
          color: '#268E6C',
        };
      case 'Pending Payment':
        return {
          bgColor: '#FCF1E3',
          color: '#DA7B11',
        };
      default:
        return {
          name: '',
          bgColor: null,
          color: null,
        };
    }
  }

  const statusComp = useMemo(() => {
    // const status = statusColor(p.statusString);
    // if (!p.statusString) {
    //   return false;
    // }
    // return (
    //   <Text
    //     fontSize={14}
    //     style={[
    //       LAYOUT['py-2'],
    //       {
    //         backgroundColor: status.bgColor || undefined,
    //         color: status.color || undefined,
    //         borderColor: status.color || undefined,
    //         borderWidth: 1,
    //         borderRadius: 6,
    //         width: 100,
    //         textAlign: 'center',
    //       },
    //     ]}>
    //     {p.statusString}
    //   </Text>
    // );
  }, []);
  return (
    <View backgroundColor={colors.white} flex={1}>
      <Header title="" left="back" />
      <ScrollView backgroundColor={colors.white} marginX={15}>
        <HStack paddingY={'16px'}>
          <Image
            w="62px"
            h="62px"
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
          <VStack>
            <Text fontSize={12} fontWeight={600} color={'#768499'}>
              OFFLINE Elite Runner 42 Km
            </Text>
            <Text fontSize={13} fontWeight={400} color={'#1E1E1E'}>
              Elite Runner 42 Km Borobudur Marathon 2022
            </Text>
          </VStack>
        </HStack>
        <HStack
          justifyContent={'space-around'}
          borderTopColor={'#E8ECF3'}
          borderTopWidth={1}
          borderTopStyle={'solid'}
          paddingY={'16px'}>
          <VStack justifyContent={'space-evenly'}>
            <Text fontWeight={400} color="#768499" fontSize={10}>
              Registration date
            </Text>
            <Text fontWeight={400} color="#1E1E1E" fontSize={12}>
              Oct 10 - Oct 21
            </Text>
          </VStack>
          <VStack>
            <Text fontWeight={400} color="#768499" fontSize={10}>
              Running date
            </Text>
            <Text fontWeight={400} color="#1E1E1E" fontSize={12}>
              Nov 28 - Dec 07 2023
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
              02 Oct 2022, 14:32
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
              <Text fontWeight={500} color="#1E1E1E" fontSize={12}>
                {item.value}
              </Text>
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
