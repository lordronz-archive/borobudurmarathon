import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconFileDocument(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 20 20',
    // d: 'M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
    path: [
      <Path
        d="M7.50033 14.1667H12.5003M7.50033 11.6667H12.5003M15.8337 7.5L11.667 7.5C11.2068 7.5 10.8337 7.1269 10.8337 6.66667V2.5M5.00033 17.5H15.0003C15.4606 17.5 15.8337 17.1269 15.8337 16.6667L15.8337 7.32656C15.8337 7.11662 15.7544 6.91443 15.6118 6.76038L11.9144 2.76716C11.7566 2.59683 11.535 2.5 11.3029 2.5L5.00033 2.5C4.54009 2.5 4.16699 2.8731 4.16699 3.33334L4.16699 16.6667C4.16699 17.1269 4.54009 17.5 5.00033 17.5Z"
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
