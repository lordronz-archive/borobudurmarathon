import {Box, Image, Text} from 'native-base';
import React from 'react';

const HEIGHT = 70;

type Props = {
  title: string;
  logo: any;
};

export default function SponsorCard2(props: Props) {
  return (
    <Box width="50%" alignItems="center" py="5">
      <Text
        fontSize={12}
        fontWeight={400}
        marginBottom={'12px'}
        color="gray.500"
        mb="2">
        {props.title}
      </Text>
      {typeof props.logo === 'string' ? (
        <Image
          alt={props.title}
          src={props.logo}
          width="full"
          height={HEIGHT}
          resizeMethod="resize"
          resizeMode="contain"
        />
      ) : (
        props.logo
      )}
    </Box>
  );
}
