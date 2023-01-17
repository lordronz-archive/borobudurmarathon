import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconHome(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 22 19',
    path: [
      <Path
        d="M1 18H21M11.6585 1.24987L18.6585 7.37487C18.8755 7.56475 19 7.83908 19 8.12744V16.9999C19 17.5522 18.5523 17.9999 18 17.9999H14C13.4477 17.9999 13 17.5522 13 16.9999V12.9999C13 12.4476 12.5523 11.9999 12 11.9999H10C9.44772 11.9999 9 12.4476 9 12.9999V16.9999C9 17.5522 8.55228 17.9999 8 17.9999H4C3.44772 17.9999 3 17.5522 3 16.9999V8.12744C3 7.83908 3.12448 7.56475 3.3415 7.37487L10.3415 1.24986C10.7185 0.919967 11.2815 0.919967 11.6585 1.24987Z"
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
