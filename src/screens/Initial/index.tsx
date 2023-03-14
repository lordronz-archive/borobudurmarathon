/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {Box, Center, Spinner} from 'native-base';
import useInit from '../../hooks/useInit';
import {useIsFocused} from '@react-navigation/native';

export default function InitialScreen() {
  const isFocused = useIsFocused();
  const {init} = useInit();

  useEffect(() => {
    if (isFocused) {
      init();
    }
  }, [isFocused]);
  return (
    <Box justifyContent="center" alignItems="center" flex={1}>
      <Center>
        <Spinner size="lg" />
      </Center>
    </Box>
  );
}
