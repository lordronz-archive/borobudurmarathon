import {
  HStack,
  Image,
  VStack,
  Text,
  Box,
  AspectRatio,
  Stack,
  Badge,
} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ImageSourcePropType} from 'react-native';

type CardEventProps = {
  title: string;
  place: string;
  date: string;
  image: ImageSourcePropType;
  isAvailable?: boolean;
};

export default function CardEvent({
  title,
  place,
  date,
  image,
  isAvailable = true,
}: CardEventProps) {
  const {t} = useTranslation();

  return (
    <Box alignItems="flex-start" my={3} width="100%">
      <HStack flex={1} alignItems={'center'}>
        <AspectRatio w="20%" ratio={1 / 1}>
          <Image
            source={image}
            w="100%"
            h="100%"
            borderRadius={5}
            alt={title}
          />
        </AspectRatio>
        <Stack pl={3} flex={1}>
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
              {t('event.expiredEvents')}
            </Badge>
          )}
          <Text
            fontSize="md"
            mt="1"
            flex={1}
            fontWeight="600"
            fontFamily="Poppins-Medium">
            {title}
          </Text>
          <HStack space={1}>
            <VStack width="40%" flex={1}>
              <Text fontSize="xs" color="coolGray.500">
                {t('event.registrationDate')}
              </Text>
              <Text fontSize="xs" color="coolGray.800">
                {date}
              </Text>
            </VStack>
            <VStack width="50%" flex={1}>
              <Text fontSize="xs" color="coolGray.500">
                {t('event.place')}
              </Text>
              <Text
                fontSize="xs"
                color="coolGray.800"
                ellipsizeMode="tail"
                numberOfLines={1}>
                {place}
              </Text>
            </VStack>
          </HStack>
        </Stack>
      </HStack>
    </Box>
  );
}
