import {Box} from 'native-base';
import React from 'react';

type Props = {
  logo: any;
};

export default function SponsorCard3(props: Props) {
  return (
    <Box width="33%" alignItems="center" py="3">
      {props.logo}
    </Box>
  );
}
