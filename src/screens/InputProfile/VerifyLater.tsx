import {Box, Text, VStack} from 'native-base';
import React from 'react';
import I18n from '../../lib/i18n';
import Header from '../../components/header/Header';

export default function VerifyLaterScreen() {
  return (
    <VStack flex="1">
      <Box flex="10">
        <Header title="Verify Later Info" left={'back'} />
        <VStack space="1.5" px="4">
          {/* <Text fontWeight={400} color="#768499" fontSize={11}>
            {I18n.t('consent.subtitle')}
          </Text> */}
          <Box>
            <Text fontWeight={400} color="#1E1E1E" fontSize={12}>
              {I18n.t('consent.description')}
            </Text>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
}
