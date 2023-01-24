import React from 'react';
import {Box, Center, Spinner} from 'native-base';

export default function LoadingBlock() {
  return (
    <Box
      justifyContent="center"
      alignItems="center"
      flex={1}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
      }}>
      <Center>
        <Spinner size="lg" />
      </Center>
    </Box>
  );
}
