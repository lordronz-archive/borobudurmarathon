import {Box, Center, Text} from 'native-base';
import React from 'react';

type Props = {
  title: string;
};
export default function LineTitle(props: Props) {
  return (
    <Box height="3" mb="5" mt="3">
      <Box borderBottomWidth={1} borderBottomColor="gray.300" />
      <Center>
        <Box position="absolute" bgColor="white" height="25" px="3" zIndex={10}>
          <Text color="gray.500" fontSize="md">
            {props.title}
          </Text>
        </Box>
      </Center>
    </Box>
  );
}
