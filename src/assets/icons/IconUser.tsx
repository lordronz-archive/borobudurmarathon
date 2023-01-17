import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconUser(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 20 20',
    // d: 'M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
    path: [
      <Path
        d="M15.2165 17.3323C13.9348 15.9008 12.0725 15 9.99984 15C7.92718 15 6.06492 15.9008 4.7832 17.3323M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10ZM13 9C13 10.6569 11.6569 12 10 12C8.34315 12 7 10.6569 7 9C7 7.34315 8.34315 6 10 6C11.6569 6 13 7.34315 13 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />,
    ],
  });

  return <Icon {...props} />;
}
