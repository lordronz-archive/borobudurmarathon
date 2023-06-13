import {useNavigation} from '@react-navigation/native';
import {Box, Text, VStack, ScrollView, Divider, Image} from 'native-base';
import React from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import SectionListMyEvent from './components/SectionListMyEvent';
import {useTranslation} from 'react-i18next';
import AppContainer from '../../layout/AppContainer';

export default function MyEvents() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();

  return (
    <AppContainer>
      <Image
        borderRadius={8}
        source={require('../../assets/images/welcome-card-img.png')}
        alt=""
        top="0"
        right="0"
        position="absolute"
      />
      <Box px="4">
        <BackHeader onPress={() => navigation.goBack()} />
        <VStack space="1.5">
          <Heading>{t('myEvent.title')}</Heading>
          <Text fontWeight={400} color="#768499" fontSize={11}>
            {t('myEvent.subtitle')}
          </Text>
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
      <ScrollView>
        <SectionListMyEvent />
      </ScrollView>
    </AppContainer>
  );
}
