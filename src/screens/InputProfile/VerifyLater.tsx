import {Box, Text, VStack} from 'native-base';
import React from 'react';
import Header from '../../components/header/Header';
import {useTranslation} from 'react-i18next';

export default function VerifyLaterScreen() {
  const {t} = useTranslation();
  return (
    <VStack flex="1">
      <Box flex="10">
        <Header title="Verify Later Info" left={'back'} />
        <VStack space="1.5" px="4">
          {/* <Text fontWeight={400} color="#768499" fontSize={11}>
            {t('consent.subtitle')}
          </Text> */}
          <Box>
            <Text fontWeight={400} color="#1E1E1E" fontSize={12}>
              {t('consent.description')}
            </Text>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
}
