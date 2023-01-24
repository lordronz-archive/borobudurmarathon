import {
  HStack,
  Image,
  VStack,
  Text,
  Box,
  AspectRatio,
  Stack,
  Badge,
  Alert,
} from 'native-base';
import React from 'react';
import {ImageSourcePropType} from 'react-native';
import IconRun from '../../assets/icons/IconRun';
import IconTag from '../../assets/icons/IconTag';
import MButton from '../buttons/Button';

type MyCardEventProps = {
  title: string;
  place: string;
  date: string;
  image: ImageSourcePropType;
  isAvailable?: boolean;
};

export default function MyCardEvent({
  title,
  place,
  date,
  image,
  isAvailable = true,
}: MyCardEventProps) {
  return (
    <Box alignItems="flex-start" my={3} width="100%">
      <HStack flex={1}>
        <Stack pl={3} flexGrow={1}>
          <HStack flex="1" justifyContent={'space-between'} space="1">
            <Text
              flex={'1'}
              fontSize="md"
              mt="0"
              fontWeight="600"
              fontFamily="Poppins-Medium"
              flexWrap={'wrap'}>
              {title}
            </Text>
            {!isAvailable && (
              <Badge
                backgroundColor="gray.200"
                px="3"
                py="0.5"
                borderRadius="4"
                alignSelf="flex-start"
                _text={{
                  color: 'gray.500',
                  fontWeight: 'bold',
                  fontSize: 'xs',
                }}>
                Expired Event
              </Badge>
            )}
          </HStack>
          <HStack flex="1" justifyContent={'space-between'}>
            <HStack space={1} alignItems="center">
              <IconRun />
              <Text fontSize="xs" color="coolGray.500">
                Nov 28 - Dec 07 2022
              </Text>
            </HStack>
            <HStack space={2} alignItems="center">
              <IconTag />
              <Text fontSize="xs" color="coolGray.800">
                Elite Runner 42 Km
              </Text>
            </HStack>
          </HStack>
          <HStack mt="2" space="2">
            <Alert
              status="warning"
              bgColor={'#FFF8E4'}
              borderRadius={8}
              flexGrow={1}>
              <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} justifyContent="space-between">
                  <HStack space={2} flexShrink={1} alignItems="center">
                    <Alert.Icon mt="1" />
                    <Text fontSize={12} color="coolGray.800">
                      Pay before 02 Oct 2022, 14:32
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
            <MButton variant="outline" _text={{fontSize: 12}}>
              Pay Now
            </MButton>
          </HStack>
        </Stack>
      </HStack>
    </Box>
  );
}
