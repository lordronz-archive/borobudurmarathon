import {useNavigation} from '@react-navigation/native';
import {
  Box,
  Text,
  VStack,
  Divider,
  Image,
  HStack,
  CheckIcon,
} from 'native-base';
import React from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import AppContainer from '../../layout/AppContainer';
import TextInput from '../../components/form/TextInput';
import Button from '../../components/buttons/Button';
import IconVoucher from '../../assets/icons/IconVoucher';
import VoucherCard from './components/VoucherCard';

export default function VoucherScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();

  return (
    <AppContainer>
      <Image
        borderRadius={8}
        source={require('../../assets/images/welcome-card-img.png')}
        alt="Alternate Text"
        top="0"
        right="0"
        position="absolute"
      />
      <Box px="4">
        <BackHeader onPress={() => navigation.goBack()} />
        <VStack space="1.5">
          <Heading>Voucher</Heading>
          <VStack>
            <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
              {t('payment.haveAVoucherCode')}
            </Text>
            <Text fontWeight={400} color="#768499" fontSize={11}>
              {t('payment.haveAVoucherCodeDesc')}
            </Text>
          </VStack>
          <HStack space={1.5} maxH={50}>
            <TextInput placeholder="e.g. BR219" maxW={'80%'} />
            <Button>
              <CheckIcon color="white" />
            </Button>
          </HStack>
        </VStack>
      </Box>
      <Divider
        my="2"
        _light={{
          bg: '#E8ECF3',
          height: '8px',
        }}
        _dark={{
          bg: 'muted.50',
        }}
      />
      <VStack>
        <VoucherCard></VoucherCard>
      </VStack>
    </AppContainer>
  );
}
