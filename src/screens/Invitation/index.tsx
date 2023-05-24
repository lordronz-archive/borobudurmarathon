import {useNavigation} from '@react-navigation/native';
import {Box, VStack} from 'native-base';
import React from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import AppContainer from '../../layout/AppContainer';
import SectionListInvitation from './components/SectionListInvitation';
import {t} from 'i18next';
import Header from '../../components/header/Header';

export default function ListInvitationScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <AppContainer>
      <Header title={t('profile.invitedEvents')} left="back" />

      <SectionListInvitation />
    </AppContainer>
  );
}
