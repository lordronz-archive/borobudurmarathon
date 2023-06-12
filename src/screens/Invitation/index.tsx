import React from 'react';
import AppContainer from '../../layout/AppContainer';
import SectionListInvitation from './components/SectionListInvitation';
import {t} from 'i18next';
import Header from '../../components/header/Header';

export default function ListInvitationScreen() {

  return (
    <AppContainer>
      <Header title={t('profile.invitedEvents')} left="back" />

      <SectionListInvitation />
    </AppContainer>
  );
}
