import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconCalendar(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 18 20',
    path: [
      <Path
        d="M1 7H17M13 1V3M5 1V3M2 3H16C16.5523 3 17 3.44772 17 4V18C17 18.5523 16.5523 19 16 19H2C1.44772 19 1 18.5523 1 18V4C1 3.44772 1.44772 3 2 3ZM5.25 11H8.75C8.88807 11 9 11.1119 9 11.25V14.75C9 14.8881 8.88807 15 8.75 15H5.25C5.11193 15 5 14.8881 5 14.75V11.25C5 11.1119 5.11193 11 5.25 11Z"
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
