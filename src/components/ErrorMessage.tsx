import {t} from 'i18next';
import {Box, Flex, Image, Text, VStack} from 'native-base';
import React from 'react';
import Button from './buttons/Button';

type Props = {
  title?: string;
  description?: string;
  buttonTitle?: string;
  onPress?: () => void;
};

export default function ErrorMessage(props: Props) {
  return (
    <Flex my={5} flex={1}>
      <Image
        source={require('../assets/images/hiasan-not-found.png')}
        alignSelf={'center'}
        mb={1}
        alt="Data error"
      />
      <Text textAlign={'center'} fontSize={'lg'} fontWeight={'bold'} mb={1}>
        {props.title || t('message.errorTitle')}
      </Text>
      <Text textAlign={'center'} fontSize={'sm'} color={'gray.400'}>
        {props.description || t('message.errorMessage')}
      </Text>
      {props.onPress ? (
        <Box mt="5">
          <Button onPress={props.onPress}>
            {props.buttonTitle || 'Try Again'}
          </Button>
        </Box>
      ) : (
        false
      )}
    </Flex>
  );
}
