import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconDownload(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 13 18',
    // d: 'M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
    path: [
      <Path
        d="M1.08984 16.5H11.0898M6.08984 1.5V13.1667M6.08984 13.1667L10.2565 9M6.08984 13.1667L1.92318 9"
        stroke="#1E1E1E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />,
    ],
  });

  return <Icon {...props} />;
}
