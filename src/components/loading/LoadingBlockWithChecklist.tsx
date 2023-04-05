import React from 'react';
import {
  Box,
  Center,
  CheckCircleIcon,
  CircleIcon,
  CloseIcon,
  HStack,
  MinusIcon,
  Spinner,
  Text,
  VStack,
} from 'native-base';

type Props = {
  text?: string;
  checklists: {
    key: string;
    text: string;
    status: 'loading' | 'done' | 'failed' | 'skipped';
  }[];
  style?: any;
};
export default function LoadingBlockWithChecklist(props: Props) {
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
      {props.checklists.length === 0 ? (
        <Center>
          <Spinner size="lg" />
          {!!props.text && <Text color="gray.400">{props.text}</Text>}
        </Center>
      ) : (
        <Center>
          <Spinner size="lg" />
          {!!props.text && <Text color="gray.400">{props.text}</Text>}
        </Center>
      )}

      <VStack justifyContent="flex-start" mt="10" mb="20">
        {props.checklists.map(check => (
          <HStack alignItems="center" mt="1" key={check.key}>
            {check.status === 'failed' ? (
              <CloseIcon size="sm" color="red.500" />
            ) : check.status === 'done' ? (
              <CheckCircleIcon size="sm" color="green.500" />
            ) : check.status === 'skipped' ? (
              <CircleIcon size="sm" color="gray.400" />
            ) : (
              <Spinner size="sm" />
            )}
            <Text
              color={check.status === 'loading' ? 'gray.700' : 'gray.400'}
              ml="2">
              {check.text}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
