import React from 'react';
import {Center, ChevronRightIcon, Text, Image} from 'native-base';
import {Linking, TouchableOpacity} from 'react-native';

type Props = {
  title: string;
  items: {logo: any; description?: string; url?: string; urlText?: string}[];
};

export default function SponsorCard(props: Props) {
  return (
    <Center mt="6" mb="6">
      <Text color="gray.400">{props.title}</Text>

      {props.items.map(item => (
        <Center px="10">
          {typeof item.logo === 'string' ? (
            <Image src={item.logo} />
          ) : (
            item.logo
          )}

          <Text color="gray.400" fontSize="sm" textAlign="center">
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
          </TouchableOpacity>
        </Center>
      ))}
    </Center>
  );
}
