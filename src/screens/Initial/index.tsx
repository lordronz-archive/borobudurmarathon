/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Box, Center, Spinner} from 'native-base';
import useInit from '../../hooks/useInit';

export default function InitialScreen() {
  const _init = useInit();

  return (
    <Box justifyContent="center" alignItems="center" flex={1}>
      <Center>
        <Spinner size="lg" />
      </Center>
    </Box>
  );
}
