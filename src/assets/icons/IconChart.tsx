import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconChart(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 20 18',
    path: [
      <Path
        d="M7 17V8H2C1.44772 8 1 8.44772 1 9V17H7ZM7 17H13M7 17V2C7 1.44772 7.44772 1 8 1H12C12.5523 1 13 1.44772 13 2V17M13 17H19V6C19 5.44772 18.5523 5 18 5H13V17Z"
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
