import {Box, Image, Text} from 'native-base';
import React from 'react';

type Props = {
  title: string;
  logo: any;
};

export default function SponsorCard2(props: Props) {
  return (
    <Box width="50%" alignItems="center" py="5">
      <Text
        fontSize={'10px'}
        fontWeight={400}
        marginBottom={'12px'}
        color="gray.500"
        mb="2">
        {props.title}
      </Text>
      {typeof props.logo === 'string' ? <Image src={props.logo} /> : props.logo}
    </Box>
  );
}
