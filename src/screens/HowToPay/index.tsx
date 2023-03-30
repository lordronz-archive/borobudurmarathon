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
import {useTranslation} from 'react-i18next';
import Accordion from 'react-native-collapsible/Accordion';
import Header from '../../components/header/Header';
import AppContainer from '../../layout/AppContainer';

export default function HowToPayScreen() {
  const {colors} = useTheme();

  const [activeSectionsVaBankSulteng, setActiveSectionsVaBankSulteng] =
    useState<any>([]);
  const [activeSectionsSaveDuit, setActiveSectionsSaveDuit] = useState<any>([]);
  const [
    activeSectionsKonfirmasiStatusBlokir,
    setActiveSectionsKonfirmasiStatusBlokir,
  ] = useState<any>([]);

  const {t} = useTranslation();

  const _renderContent = (section: any) => {
    return (
      <View marginX={'15px'}>
        {section.content?.map((item: string, index: number) =>
          typeof item !== 'string' ? (
            item
          ) : (
            <HStack paddingY={'4px'} key={index}>
              <Text fontSize={12} fontWeight={400} color={'#201D1D'}>{`${
                index + 1
              }. `}</Text>
              <Text
                fontSize={12}
                fontWeight={400}
                color={'#201D1D'}
                flex={1}
                lineHeight={20}>
                {item}
              </Text>
            </HStack>
          ),
        )}
      </View>
    );
  };

  const SECTIONS_KONFIRMASI_STATUS_BLOKIR = [
    {
      title: 'Melalui Ibanking Bank Jateng',
      content: [
        'Login ke ibanking.bankjateng.co.id',
        'Pilih menu "informasi rekening"',
        'Pilih menu "saldo mutasi"',
        'Pilih "detail"',
        'Cermati kolom "saldo blokir"',
        'Akan tertera saldo yang telah terblokir',
        'Selesai',
      ],
    },
  ];

  const SECTIONS_VA_BANK_JATENG = [
    {
      title: t('payment.viaBankJatengAtm'),
      content: t('payment.viaBankJatengAtmSteps', {returnObjects: true}),
    },
    {
      title: t('payment.viaIBankingJateng'),
      content: t('payment.viaIBankingJatengSteps', {returnObjects: true}),
    },
    {
      title: t('payment.viaBimaMobileBankJateng'),
      content: t('payment.viaBimaMobileBankJatengSteps', {returnObjects: true}),
    },
    {
      title: t('payment.viaOtherBanks'),
      content: t('payment.viaOtherBanksSteps', {returnObjects: true}),
    },
  ];

  const SECTIONS_SAVE_DUIT = [
    {
      title: 'ATM Bank Jateng',
      content: [
        'Masukkan Kart BPD Card ke mesin ATM Bank Jateng',
        'Pilih menu "Pembelian"',
        'Pilih menu "Lainnya"',
        'Masuk menu pembelian Borobudur Marathon; Pilih "Lanjut"',
        'Masukkan "Nomor Saveduit" pada kolom "kode bayar", pilih "benar"',
        'Transaksi diproses',
        'Cermati nominal dan rincian permintaan',
        'Pilih "Bayar"',
        'Transaksi telah berhasil, resi terbit',
        'Selesai',
        'Kunci saldo Anda telah berhasil',
      ],
    },
    {
      title: 'Ibanking Bank Jateng',
      content: [
        'Login di ibanking.bankjateng.co.id',
        'Pilih menu pembelian',
        'Pilih menu "Reward Tiket"',
        'Masuk ke form Pembelian Reward Saveduit',
        'Masukkan "Nomor Saveduit" pada kolom "ID Billing"',
        'Pilih Lanjut',
        'Cermati nominal dan rincian permintaan;',
        'Masukkan Pin (SMS} OTP (SMS)',
        'Pilih "proses"',
        'Terbit notifikasi berhasil',
        'Selesai',
        'Kunci saldo Anda telah berhasil',
      ],
    },
    {
      title: 'Konfirmasi Status Blokir',
      content: [
        'Simpan bukti status transaksi yang dilakukan, Resi dari ATM Bank Jateng atau tangkapan layar ibanking Bank Jateng.',
        'Melalui Customer Service Bank Jateng, datang ke kantor Bank Jateng terdekat dengan membawa Buku Tabungan dan Kartu BPD Card.',
        <Accordion
          sections={SECTIONS_KONFIRMASI_STATUS_BLOKIR}
          activeSections={activeSectionsKonfirmasiStatusBlokir}
          renderHeader={(item: any, index: number) => {
            return (
              <HStack paddingY={'10px'} justifyContent={'space-between'}>
                <Text fontSize={12} fontWeight={400} color={'#201D1D'}>
                  3. {item.title}
                </Text>
                {activeSectionsKonfirmasiStatusBlokir?.includes(index) ? (
                  <ChevronUpIcon />
                ) : (
                  <ChevronDownIcon />
                )}
              </HStack>
            );
          }}
          renderContent={_renderContent}
          onChange={section => setActiveSectionsKonfirmasiStatusBlokir(section)}
          underlayColor="transparent"
        />,
      ],
    },
  ];

  const _renderHeader = (item: any, index: number, activeSections: any) => {
    return (
      <HStack
        paddingY={'10px'}
        justifyContent={'space-between'}
        marginX={'15px'}>
        <Text fontSize={12} fontWeight={700} color={'#201D1D'} flex={1}>
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

  const _renderFooter = () => {
    return <Divider height={'8px'} bg={'#E8ECF3'} marginY={'10px'} />;
  };

  return (
    <AppContainer>
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
          sections={SECTIONS_VA_BANK_JATENG}
          activeSections={activeSectionsVaBankSulteng}
          renderHeader={(item: any, index: number) =>
            _renderHeader(item, index, activeSectionsVaBankSulteng)
          }
          renderContent={_renderContent}
          onChange={section => setActiveSectionsVaBankSulteng(section)}
          renderFooter={_renderFooter}
          underlayColor="transparent"
        />
        <Text
          marginX={'15px'}
          paddingY={'20px'}
          fontSize={14}
          fontWeight={600}
          color={'#201D1D'}>
          Save Duit Bank Jateng
        </Text>
        <Accordion
          sections={SECTIONS_SAVE_DUIT}
          activeSections={activeSectionsSaveDuit}
          renderHeader={(item: any, index: number) =>
            _renderHeader(item, index, activeSectionsSaveDuit)
          }
          renderContent={_renderContent}
          onChange={section => setActiveSectionsSaveDuit(section)}
          renderFooter={_renderFooter}
          underlayColor="transparent"
        />
      </ScrollView>
    </AppContainer>
  );
}
