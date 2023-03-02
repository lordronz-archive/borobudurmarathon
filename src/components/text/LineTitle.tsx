import {Box, Center} from 'native-base';
import React from 'react';

type Props = {
  title: string;
};
export default function LineTitle(props: Props) {
  return (
    <Box height="3" bgColor="red.100" mb="5" mt="3">
      <Box borderBottomWidth={1} borderBottomColor="gray.500" />
      <Center>
        <Box position="absolute" bgColor="white" height="25" px="3" zIndex={10}>
          {props.title}
        </Box>
      </Center>
    </Box>
  );
}
