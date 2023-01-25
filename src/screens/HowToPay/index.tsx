import {
  Divider,
  HStack,
  ScrollView,
  Text,
  VStack,
  View,
  useTheme,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'native-base';
import React, {useMemo, useState} from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import Header from '../../components/header/Header';

export default function HowToPayScreen() {
  const {colors} = useTheme();

  const [activeSections, setActiveSections] = useState<any>([0]);

  const SECTIONS = [
    {
      title: 'ATM Bank Jateng',
      content: [
        'Masukkan kartu ATM Bank Jateng dan PIN Kamu',
        'Pilih TRANSAKSI LAINNYA > TRANSFER > pilih REKENING BANK JATENG',
        'Masukkan nomor Virtual Account',
        'Masukkan nominal sesuai tagihan',
        'Validasi pembayaran',
        'Pembayaran selesai',
      ],
    },
    {
      title: 'Mobile Banking Bank Jateng',
      content: [
        'Login ke Bank Jateng Mobile Application kamu',
        'Pilih Bayar > Pilih Buat Pembayaran Baru > Pilih Multipayment',
        'Pilih Penyedia Jasa',
        'Cari Midtrans atau langsung ketik Midtrans di kolom pencarian',
        'Masukkan nomor Virtual Account di Kode Bayar',
        'Masukkan nominal pembayaran sesuai tagihan',
        'Klik Lanjut > Klik Konfirmasi',
        'Masukkan PIN',
        'Transaksi selesai',
      ],
    },
    {
      title: 'Internet Banking Bank Jateng',
      content: [
        'Login ke Bank Jateng Internet Banking kamu',
        'Pilih Payment > pilih Multipayment',
        'Pilih Rekening Sumber',
        'Cari Midtrans atau langsung ketik Midtrans di kolom pencarian',
        'Masukkan nomor Virtual Account',
        'Masukkan nominal pembayaran sesuai tagihan',
        'Klik Lanjut > Klik Konfirmasi',
        'Ikuti instruksi selanjutnya untuk menyelesaikan transaksi',
      ],
    },
  ];

  const _renderHeader = (item: any, index: number, activeSections: any) => {
    return (
      <HStack
        paddingY={'10px'}
        justifyContent={'space-between'}
        marginX={'15px'}>
        <Text fontSize={12} fontWeight={700} color={'#201D1D'}>
          {item.title}
        </Text>
        {activeSections?.includes(index) ? (
          <ChevronUpIcon />
        ) : (
          <ChevronDownIcon />
        )}
      </HStack>
    );
  };

  const _renderContent = (section: any) => {
    return (
      <View marginX={'15px'}>
        {section.content?.map((item: string, index: number) => (
          <HStack paddingY={'4px'}>
            <Text fontSize={12} fontWeight={400} color={'#201D1D'}>{`${
              index + 1
            }. `}</Text>
            <Text fontSize={12} fontWeight={400} color={'#201D1D'}>
              {item}
            </Text>
          </HStack>
        ))}
      </View>
    );
  };

  const _renderFooter = () => {
    return <Divider height={'8px'} bg={'#E8ECF3'} marginY={'10px'} />;
  };

  const _updateSections = (section: any) => {
    setActiveSections(section);
  };

  return (
    <View bg={colors.white} flex={1}>
      <Header title="How To Pay" left={'back'} />
      <ScrollView>
        <Text
          marginX={'15px'}
          paddingY={'20px'}
          fontSize={14}
          fontWeight={600}
          color={'#201D1D'}>
          Bank Jateng Virtual Account
        </Text>
        <Accordion
          sections={SECTIONS}
          activeSections={activeSections}
          renderHeader={(item: any, index: number) =>
            _renderHeader(item, index, activeSections)
          }
          renderContent={_renderContent}
          onChange={_updateSections}
          renderFooter={_renderFooter}
          underlayColor="transparent"
        />
      </ScrollView>
    </View>
  );
}
