import {View} from 'native-base';
import React from 'react';
import Header from '../../components/header/Header';
import I18n from '../../lib/i18n';
import {useAuthUser} from '../../context/auth.context';

export default function CertificatesScreen() {
  const {user} = useAuthUser();

  return (
    <View>
      <Header title={I18n.t('certificates')} left="back" />
    </View>
  );
}
