import React from 'react';
import {Box, useTheme, ScrollView, Image, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Header from '../../components/header/Header';
import {useTranslation} from 'react-i18next';
import AppContainer from '../../layout/AppContainer';

export default function InfoVerifyLaterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  const {t} = useTranslation();

  return (
    <AppContainer>
      <ScrollView backgroundColor={colors.white}>
        <Header title="Verify Profile Later Info" left="back" />
        <Box borderTopColor={colors.gray[500]} w="full">
          <Box w="full" px="25px" py="10px">
            <Text fontWeight={400} fontSize="12px" mb="12px">
              {t('profile.verifyProfileLaterInfo')}
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </AppContainer>
  );
}
