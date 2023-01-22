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
import {ImageSourcePropType, StyleSheet} from 'react-native';

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
  return (
    <Box alignItems="flex-start" my={3}>
      <HStack>
        <AspectRatio w="20%" ratio={1 / 1}>
          <Image
            source={image}
            w="100%"
            h="100%"
            borderRadius={5}
            alt={title}
          />
        </AspectRatio>
        <Stack pl={3}>
          {!isAvailable && <Badge style={styles}>Expired Event</Badge>}
          <Text fontSize="md" fontWeight="500">
            {title}
          </Text>
          <HStack space={2}>
            <VStack w={'50%'}>
              <Text fontSize="sm" color="coolGray.500">
                Date
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="sm" color="coolGray.500">
                Place
              </Text>
            </VStack>
          </HStack>
          <HStack space={2}>
            <VStack w={'50%'}>
              <Text fontSize="sm" color="coolGray.500">
                {date}
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="sm" color="coolGray.500">
                {place.length > 15 ? place.substring(0, 15) + '...' : place}
              </Text>
            </VStack>
          </HStack>
        </Stack>
      </HStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    backgroundColor: '#A9A9A9',
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
  },
});