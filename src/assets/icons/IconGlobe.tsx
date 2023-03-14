import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconGlobe(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 17 18',
    path: [
      <Path
        d="M15.9844 9C15.9844 13.1421 12.6265 16.5 8.48437 16.5M15.9844 9C15.9844 4.85786 12.6265 1.5 8.48437 1.5M15.9844 9H0.984375M8.48437 16.5C4.34224 16.5 0.984375 13.1421 0.984375 9M8.48437 16.5C9.86509 16.5 10.9844 13.1421 10.9844 9C10.9844 4.85786 9.86509 1.5 8.48437 1.5M8.48437 16.5C7.10366 16.5 5.98437 13.1421 5.98437 9C5.98437 4.85786 7.10366 1.5 8.48437 1.5M0.984375 9C0.984375 4.85786 4.34224 1.5 8.48437 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />,
    ],
  });

  return <Icon {...props} />;
}
