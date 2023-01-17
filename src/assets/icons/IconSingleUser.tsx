import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconSingleUser(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 20 20',
    // d: 'M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
    path: [
      <Path
        d="M5 15.8333C5 13.9924 7.23858 12.5 10 12.5C12.7614 12.5 15 13.9924 15 15.8333M13.3333 6.66668C13.3333 8.50763 11.8409 10 10 10C8.15905 10 6.66667 8.50763 6.66667 6.66668C6.66667 4.82573 8.15905 3.33334 10 3.33334C11.8409 3.33334 13.3333 4.82573 13.3333 6.66668Z"
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
