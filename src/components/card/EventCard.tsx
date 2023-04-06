import {HStack, VStack, Text, Box, AspectRatio, Badge} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ImageSourcePropType} from 'react-native';
import FastImage from 'react-native-fast-image';

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
      <HStack flex={1} alignItems={isAvailable ? 'center' : 'flex-start'}>
        <AspectRatio w="20%" ratio={1 / 1}>
          {/* <Image
            source={image}
            w="100%"
            h="100%"
            borderRadius={5}
            fallbackSource={require('../../assets/images/no-image.png')}
            loadingIndicatorSource={require('../../assets/images/no-image.png')}
            alt={title}
          /> */}
          <FastImage
            style={{width: '100%', height: '100%', borderRadius: 5}}
            source={
              image && (image as any).uri
                ? {
                    uri: (image as any).uri,
                    priority: FastImage.priority.high,
                  }
                : require('../../assets/images/no-image.png')
            }
            resizeMode={FastImage.resizeMode.cover}
            // onError={() => {
            //   setUri(
            //     props.images[Math.floor(Math.random() * props.images.length)],
            //   );
            // }}
          />
        </AspectRatio>
        <VStack pl={3} width="80%">
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
            mt={isAvailable ? 0 : 1}
            flex={1}
            fontWeight="600"
            fontFamily="Poppins-Medium">
            {title}
          </Text>

          <HStack space={1}>
            <VStack width="40%" flex={1}>
              <Text fontSize="xs" color="coolGray.500">
                {t('event.eventDate')}
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
        </VStack>
      </HStack>
    </Box>
  );
}
