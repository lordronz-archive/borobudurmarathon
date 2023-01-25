import React, {useMemo, useState} from 'react';
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
  ChevronDownIcon,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Header from '../../components/header/Header';
import Accordion from 'react-native-collapsible/Accordion';

export default function HowToPayScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  const [activeSections, setActiveSections] = useState<any>([0]);

  const _updateSections = (section: any) => {
    setActiveSections(section);
  };

  const ATM_BANK_JATENG = [
    'Masukkan kartu ATM Bank Jateng dan PIN Kamu',
    'Pilih TRANSAKSI LAINNYA > TRANSFER > pilih REKENING BANK JATENG',
    'Masukkan nomor Virtual Account',
    'Masukkan nominal sesuai tagihan',
    'Validasi pembayaran',
    'Pembayaran selesai',
  ];

  const MOBILE_BANKING_BANK_JATENG = [
    'Login ke Bank Jateng Mobile Application kamu',
    'Pilih Bayar > Pilih Buat Pembayaran Baru > Pilih Multipayment',
    'Pilih Penyedia Jasa',
    'Cari Midtrans atau langsung ketik Midtrans di kolom pencarian',
    'Masukkan nomor Virtual Account di Kode Bayar',
    'Masukkan nominal pembayaran sesuai tagihan',
    'Klik Lanjut > Klik Konfirmasi',
    'Masukkan PIN',
    'Transaksi selesai',
  ];

  const INTERNET_BANKING_BANK_JATENG = [
    'Login ke Bank Jateng Internet Banking kamu',
    'Pilih Payment > pilih Multipayment',
    'Pilih Rekening Sumber',
    'Cari Midtrans atau langsung ketik Midtrans di kolom pencarian',
    'Masukkan nomor Virtual Account',
    'Masukkan nominal pembayaran sesuai tagihan',
    'Klik Lanjut > Klik Konfirmasi',
    'Ikuti instruksi selanjutnya untuk menyelesaikan transaksi',
  ];

  const STRIN = [
    {title: 'First Element', content: 'Lorem ipsum dolor sit amet'},
    {title: 'Second Element', content: 'Lorem ipsum dolor sit amet'},
    {title: 'Third Element', content: 'Lorem ipsum dolor sit amet'},
  ];

  const _renderHeader = (item: any, index: number, activeSections: any) => {
    // const isActive = activeSections?.includes(index);
    return (
      <View>
        <Text size="large">{item.question}</Text>
        {activeSections ? (
          <ChevronDownIcon width={20} height={20} />
        ) : (
          <ChevronRightIcon width={20} height={20} />
        )}
      </View>
    );
  };

  const _renderContent = (section: any) => {
    return (
      <View>
        <Text>{section}</Text>
      </View>
    );
  };

  return (
    <View backgroundColor={colors.white} flex={1}>
      <Header title="" left="back" />
      <ScrollView backgroundColor={colors.white} marginX={15}>
        <Text fontSize={14} fontWeight={600} color={'#201D1D'}>
          Bank Jateng Virtual Account
        </Text>
        <Accordion
          underlayColor="white"
          sections={['as']}
          activeSections={activeSections}
          renderHeader={(item: any, index: number) =>
            _renderHeader(item, index, activeSections)
          }
          renderContent={_renderContent}
          onChange={_updateSections}
        />
      </ScrollView>
    </View>
  );
}
