import {
  HStack,
  Image,
  VStack,
  Text,
  Box,
  AspectRatio,
  Stack,
  Divider,
} from 'native-base';
import React, {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';

type EventRegistrationCardProps = {
  isAvailable?: boolean;
  runningDate?: ReactNode;
  title?: ReactNode;
  category?: ReactNode;
  eventType?: string;
  registrationDate?: ReactNode;
  imgSrc?: any;
};

export default function EventRegistrationCard({
  title,
  runningDate,
  category,
  eventType,
  imgSrc,
  registrationDate,
}: EventRegistrationCardProps) {
  const {t} = useTranslation();
  return (
    <Box alignItems="flex-start" my={0} mt={3} width="100%" px="4">
      <HStack flex={1}>
        <AspectRatio w="20%" ratio={1 / 1}>
          <Image
            source={imgSrc}
            w="100%"
            h="100%"
            borderRadius={5}
            alt={title?.toString() ?? 'Event Image'}
          />
        </AspectRatio>
        <Stack pl={3} flexGrow={1} flex="1">
          <HStack space="1" flex="1">
            <Text
              fontSize="12px"
              fontWeight="600"
              fontFamily="Poppins-Medium"
              flexWrap="wrap"
              color="#768499"
              flex="1">
              {eventType} • {category}
            </Text>
          </HStack>
          <Text
            fontSize="13px"
            fontWeight="400"
            fontFamily="Poppins-Medium"
            flexWrap="wrap"
            flex="1">
            {title}
          </Text>
        </Stack>
      </HStack>
      <Divider
        my="2"
        _light={{
          bg: '#E8ECF3',
          height: '1px',
        }}
        _dark={{
          bg: 'muted.50',
        }}
      />
      <HStack space={2}>
        <VStack w={'50%'}>
          <Text fontSize="xs" color="coolGray.500">
            {t('event.registrationDate')}
          </Text>
        </VStack>
        <VStack>
          <Text fontSize="xs" color="coolGray.500">
            {t('event.runningDate')}
          </Text>
        </VStack>
      </HStack>
      <HStack space={2}>
        <VStack w={'50%'}>
          <Text fontSize="xs" color="coolGray.800">
            {registrationDate}
          </Text>
        </VStack>
        <VStack>
          <Text fontSize="xs" color="coolGray.800">
            {runningDate}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}
