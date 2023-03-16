import {t} from 'i18next';
import {Flex, Image, Text} from 'native-base';
import React from 'react';

export default function EmptyMessage() {
  return (
    <Flex my={5} flex={1}>
      <Image
        source={require('../assets/images/hiasan-not-found.png')}
        alignSelf={'center'}
        mb={1}
        alt="Data empty"
      />
      <Text textAlign={'center'} fontSize={'lg'} fontWeight={'bold'} mb={1}>
        {t('dataEmpty')}
      </Text>
      <Text textAlign={'center'} fontSize={'sm'} color={'gray.400'}>
        {t('dataEmptyDesc')}
      </Text>
    </Flex>
  );
}
