import React from 'react';
import {Center, Text, Image, Box} from 'native-base';

const HEIGHT = 85;
type Props = {
  title: string;
  items: {logo: any; description?: string; url?: string; urlText?: string}[];
};

export default function SponsorCard(props: Props) {
  return (
    <Center mt="1" mb="1">
      <Text fontSize={12} fontWeight={400} mb={'12px'} color="gray.400">
        {props.title}
      </Text>

      {props.items.map(item => (
        <Center px="10" key={item.description}>
          <Box width="60%" alignItems="center" py="3">
            {typeof item.logo === 'string' ? (
              <Image
                alt={item.description}
                src={item.logo}
                width={230}
                height={HEIGHT}
                resizeMode="contain"
              />
            ) : (
              item.logo
            )}
          </Box>

          {/* <Text color="gray.400" fontSize="sm" textAlign="center">
            {item.description}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (item.url) {
                Linking.openURL(item.url);
              }
            }}>
            <Text color="yellow.500" bold>
              {item.urlText || 'Know More'}
              <ChevronRightIcon />
            </Text>
          </TouchableOpacity> */}
        </Center>
      ))}
    </Center>
  );
}
