import {useRoute} from '@react-navigation/native';
import {
  Divider,
  HStack,
  ScrollView,
  Text,
  View,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'native-base';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import Accordion from 'react-native-collapsible/Accordion';
import Header from '../../components/header/Header';
import AppContainer from '../../layout/AppContainer';
import {RootStackParamList} from '../../navigation/RootNavigator';

export default function HowToPayScreen() {
  const route = useRoute();
  const params = route.params as RootStackParamList['HowToPay'];

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
      title: t('payment.confirmBlockedStatusViaIBanking'),
      content: t('payment.confirmBlockedStatusViaIBankingSteps', {
        returnObjects: true,
      }),
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
      title: t('payment.viaSaveDuitBimaMobileTitle'),
      content: t('payment.viaSaveDuitBimaMobileSteps', {
        returnObjects: true,
      }),
    },
    {
      title: t('payment.viaSaveDuitIBankingJatengTitle'),
      content: t('payment.viaSaveDuitIBankingJatengSteps', {
        returnObjects: true,
      }),
    },
    {
      title: t('payment.viaSaveDuitBankJatengTitle'),
      content: t('payment.viaSaveDuitBankJatengSteps', {returnObjects: true}),
    },
    {
      title: t('payment.confirmBlockedStatus'),
      content: [
        ...(t('payment.confirmBlockedStatusSteps', {
          returnObjects: true,
        }) as []),
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
        {(!params?.trihPaymentType ||
          (params?.trihPaymentType &&
            params?.trihPaymentType === 'virtual_account_jateng')) && (
          <>
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
          </>
        )}
        {(!params?.trihPaymentType ||
          (params?.trihPaymentType &&
            params?.trihPaymentType === 'save_duit')) && (
          <>
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
          </>
        )}
      </ScrollView>
    </AppContainer>
  );
}
