import {AspectRatio, Box, Stack, Text, Image} from 'native-base';
import React from 'react';
import {ImageSourcePropType} from 'react-native';

type FeaturedEventCardProps = {
  title: string;
  date: string;
  image: ImageSourcePropType;
  type: 'Online' | 'Offline';
};

export default function FeaturedEventCard({
  title,
  date,
  image,
  type,
}: FeaturedEventCardProps) {
  return (
    <Box alignItems="center" borderRadius={10}>
      <Box
        maxW="80"
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1">
        <Box>
          <AspectRatio w="100%" ratio={250 / 167}>
            <Image source={image} w="100%" h="100%" alt="{title}" />
          </AspectRatio>
        </Box>
        <Stack p="3" space={2} bgColor="white">
          <Stack space={1}>
            <Text fontSize="md" fontWeight="500">
              {title}
            </Text>
            <Text fontSize="sm" color="coolGray.500">
              {type} • {date}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
