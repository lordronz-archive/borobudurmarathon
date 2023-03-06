import {Box, Image} from 'native-base';
import React from 'react';

type Props = {
  logo: any;
};

export default function SponsorCard3(props: Props) {
  return (
    <Box width="33%" alignItems="center" py="3">
      {typeof props.logo === 'string' ? <Image src={props.logo} /> : props.logo}
    </Box>
  );
}
