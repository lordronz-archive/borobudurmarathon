import React, {useMemo} from 'react';
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
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Header from '../../components/header/Header';
import IconInfo from '../../assets/icons/IconInfo';
import IconQr from '../../assets/icons/IconQr';

export default function DetailEventScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  // const [isLoggingOut, setIsLoggingOut] = useState(false);

  const DATA_LIST = [
    {title: 'Registration Dates', value: ''},
    {title: 'Running Dates', value: ''},
    {title: 'Location', value: ''},
    {title: 'Total Payment', value: ''},
  ];

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
            <Button
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
                Pay before 02 Oct 2022, 14:32
              </Text>
            </Button>
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
                    OFFLINE
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
