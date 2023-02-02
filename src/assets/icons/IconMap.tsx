import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconMap(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 12 13',
    // d: 'M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
    path: [
      <Path
        d="M7.73926 2.5L11.2393 0.75V9.5L7.73926 11.25M7.73926 2.5V11.25M7.73926 2.5L4.23926 0.75M7.73926 11.25L4.23926 9.5M4.23926 9.5V0.75M4.23926 9.5L0.739258 11.25V2.5L4.23926 0.75"
        stroke="#9FACBF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />,
    ],
  });

  return <Icon {...props} />;
}
