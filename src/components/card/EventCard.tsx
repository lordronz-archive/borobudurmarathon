import {
  HStack,
  VStack,
  Text,
  Box,
  AspectRatio,
  Badge,
  Image,
  View,
} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ImageSourcePropType} from 'react-native';
import FastImage from 'react-native-fast-image';
import {EEventStatus, EInvitationStatus} from '../../types/event.type';
import EventStatusBadge from './EventStatusBadge';
import {Grayscale} from 'react-native-color-matrix-image-filters';

type CardEventProps = {
  title: string;
  place: string;
  date: string;
  image: ImageSourcePropType;
  isAvailable?: boolean;
  status: EEventStatus;
  isInvitation?: boolean;
  isFree?: boolean;
  invitationStatus?: EInvitationStatus;
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

  const isExpired =
    props.invitationStatus === EInvitationStatus.EXPIRED ||
    status === EEventStatus.EXPIRED;
  const textTitleColor = isExpired ? '#3F4C5F' : 'black';
  const textLabelColor = isExpired ? 'coolGray.500' : 'coolGray.500';
  const textContentColor = isExpired ? 'coolGray.800' : 'coolGray.800';

  return (
    <Box alignItems="flex-start" my={3} width="100%">
      <HStack
        flex={1}
        alignItems={
          status === EEventStatus.REGISTRATION ? 'center' : 'flex-start'
        }>
        <AspectRatio w="20%" ratio={1 / 1} borderRadius={10} overflow="hidden">
          {/* <Image
          source={image}
          w="100%"
          h="100%"
          borderRadius={5}
          fallbackSource={require('../../assets/images/no-image.png')}
          loadingIndicatorSource={require('../../assets/images/no-image.png')}
          alt={title}
        /> */}
          {isExpired ? (
            <Grayscale>
              <FastImage
                defaultSource={require('../../assets/images/no-image.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 10,
                  overflow: 'hidden',
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
            </Grayscale>
          ) : (
            <FastImage
              defaultSource={require('../../assets/images/no-image.png')}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 10,
                overflow: 'hidden',
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
          )}
        </AspectRatio>

        <VStack pl={3} width="80%">
          <HStack space={1}>
            <EventStatusBadge
              isInvitation={props.isInvitation}
              invitationStatus={props.invitationStatus}
              eventStatus={status}
            />

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
          </HStack>

          <Text
            fontSize="md"
            mt={status === EEventStatus.REGISTRATION ? 0 : 1}
            flex={1}
            fontWeight="600"
            color={textTitleColor}
            fontFamily="Poppins-Medium">
            {title}
          </Text>

          <HStack space={1}>
            <VStack width="40%" flex={1}>
              <Text fontSize="xs" color={textLabelColor}>
                {t('event.eventDate')}
              </Text>
              <Text fontSize="xs" color={textContentColor}>
                {date}
              </Text>
            </VStack>
            <VStack width="50%" flex={1}>
              <Text fontSize="xs" color={textLabelColor}>
                {t('event.place')}
              </Text>
              <Text
                fontSize="xs"
                color={textContentColor}
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
