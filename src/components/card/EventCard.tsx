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
  status:
    | 'UPCOMING'
    | 'REGISTRATION'
    | 'REGISTRATION_CLOSED'
    | 'EXPIRED'
    | 'INVITED';
  isFree?: boolean;
  isExpired?: boolean;
  isInvitation?: boolean;
  isRegistered?: boolean;
};

export default function CardEvent({
  title,
  place,
  date,
  image,
  status,
  isFree,
  ...props
}: CardEventProps) {
  const {t} = useTranslation();

  return (
    <Box alignItems="flex-start" my={3} width="100%">
      <HStack
        flex={1}
        alignItems={status === 'REGISTRATION' ? 'center' : 'flex-start'}>
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
            defaultSource={require('../../assets/images/no-image.png')}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 5,
            }}
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
          {status === 'REGISTRATION_CLOSED' && (
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
              {t('event.registrationClosed')}
            </Badge>
          )}
          {status === 'EXPIRED' && (
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
          {status === 'UPCOMING' && (
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
              {t('event.upcomingEvents')}
            </Badge>
          )}
          {status === 'INVITED' && (
            <Badge
              backgroundColor="#FFF8E4"
              px="3"
              py="0.5"
              borderRadius="4"
              alignSelf="flex-start"
              _text={{
                color: '#A4660A',
                fontWeight: 'bold',
                fontSize: 'xs',
              }}>
              {t('event.upcomingEvents')}
            </Badge>
          )}
          {isFree && (
            <Badge
              backgroundColor="#DFF4E0"
              px="3"
              py="0.5"
              borderRadius="4"
              alignSelf="flex-start"
              _text={{
                color: '#138918',
                fontWeight: 'bold',
                fontSize: 'xs',
              }}>
              {'FREE'}
            </Badge>
          )}
          {props.isExpired && (
            <Badge
              backgroundColor="#E8ECF3"
              px="3"
              py="0.5"
              borderRadius="4"
              alignSelf="flex-start"
              _text={{
                color: '#768499',
                fontWeight: 'bold',
                fontSize: 'xs',
              }}>
              {t('event.expiredInvitation')}
            </Badge>
          )}

          {!props.isExpired && !props.isRegistered && props.isInvitation && (
            <Badge
              backgroundColor="#FFF8E4"
              px="3"
              py="0.5"
              borderRadius="4"
              alignSelf="flex-start"
              _text={{
                color: '#A4660A',
                fontWeight: 'bold',
                fontSize: 'xs',
              }}>
              Invited
            </Badge>
          )}

          <Text
            fontSize="md"
            mt={status === 'REGISTRATION' ? 0 : 1}
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
