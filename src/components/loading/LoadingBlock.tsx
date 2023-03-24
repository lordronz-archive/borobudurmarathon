import React from 'react';
import {Box, Center, Spinner, Text} from 'native-base';

type Props = {
  text?: string;
  style?: any;
};
export default function LoadingBlock(props: Props) {
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
        ...(props.style || {}),
      }}>
      <Center>
        <Spinner size="lg" />
        {!!props.text && <Text color="gray.400">{props.text}</Text>}
      </Center>
    </Box>
  );
}
