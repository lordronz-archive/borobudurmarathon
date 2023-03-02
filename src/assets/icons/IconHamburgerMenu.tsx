import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconHamburgerMenu(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 17 12',
    path: [
      <Path
        d="M1.48438 11H15.4844M1.48438 6H15.4844M1.48438 1H15.4844"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />,
    ],
  });

  return <Icon {...props} />;
}
