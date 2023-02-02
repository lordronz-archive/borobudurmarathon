import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconTimer(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 12 13',
    // d: 'M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
    path: [
      <Path
        d="M5.65592 7.58332V5.24999M10.9059 3.49999L9.73926 2.33332M4.48926 1.16666H6.82259M10.3226 7.58332C10.3226 10.1607 8.23325 12.25 5.65592 12.25C3.0786 12.25 0.989258 10.1607 0.989258 7.58332C0.989258 5.00599 3.0786 2.91666 5.65592 2.91666C8.23325 2.91666 10.3226 5.00599 10.3226 7.58332Z"
        stroke="#9FACBF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={'transparent'}
      />,
    ],
  });

  return <Icon {...props} />;
}
