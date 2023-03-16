import {Box, Image} from 'native-base';
import React from 'react';

const HEIGHT = 70;

type Props = {
  logo: any;
};

export default function SponsorCard3(props: Props) {
  return (
    <Box width="33%" alignItems="center" py="3">
      {typeof props.logo === 'string' ? (
        <Image
          alt={'co-sponsor'}
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
