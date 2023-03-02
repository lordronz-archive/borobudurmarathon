import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconPhone(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 17 18',
    path: [
      <Path
        d="M4.85599 1.5H2.56332C1.69129 1.5 0.984375 2.20692 0.984375 3.07895C0.984375 10.4912 6.99319 16.5 14.4054 16.5C15.2775 16.5 15.9844 15.7931 15.9844 14.9211V12.6284C15.9844 11.9469 15.5695 11.334 14.9367 11.0809L12.7403 10.2024C12.1719 9.97502 11.5246 10.0776 11.0544 10.4695L10.487 10.9423C9.82475 11.4941 8.85101 11.45 8.24148 10.8404L6.64394 9.2429C6.03441 8.63337 5.99024 7.65963 6.54208 6.99742L7.01491 6.43003C7.40681 5.95974 7.50936 5.31246 7.282 4.74407L6.40345 2.54768C6.15034 1.91492 5.53749 1.5 4.85599 1.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />,
    ],
  });

  return <Icon {...props} />;
}
