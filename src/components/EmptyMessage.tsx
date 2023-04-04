import {t} from 'i18next';
import {Flex, Image, Text} from 'native-base';
import React from 'react';

type Props = {
  title?: string;
  description?: string;
};

export default function EmptyMessage(props: Props) {
  return (
    <Flex my={5} flex={1}>
      <Image
        source={require('../assets/images/hiasan-not-found.png')}
        alignSelf={'center'}
        mb={1}
        alt={props.title || t('dataEmpty') || 'Data Empty'}
      />
      <Text textAlign={'center'} fontSize={'lg'} fontWeight={'bold'} mb={1}>
        {props.title || t('dataEmpty')}
      </Text>
      <Text textAlign={'center'} fontSize={'sm'} color={'gray.400'}>
        {props.description || t('dataEmptyDesc')}
      </Text>
    </Flex>
  );
}
