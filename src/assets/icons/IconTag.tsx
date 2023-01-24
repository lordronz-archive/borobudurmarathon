import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconTag(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 21 21',
    path: [
      <Path
        d="M3.50214 11.0333L9.70796 17.2392C10.0334 17.5646 10.561 17.5646 10.8865 17.2392L16.779 11.3466C17.1045 11.0212 17.1045 10.4935 16.779 10.1681L10.5732 3.96226C10.3983 3.78738 10.1548 3.69922 9.9085 3.72161L4.50699 4.21265C4.10637 4.24908 3.78895 4.56649 3.75253 4.96712L3.26148 10.3686C3.23909 10.6149 3.32726 10.8585 3.50214 11.0333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />,
      <Path
        d="M7.05601 7.51634C7.38144 7.1909 7.90908 7.1909 8.23452 7.51634C8.55996 7.84177 8.55996 8.36941 8.23452 8.69485C7.90908 9.02028 7.38144 9.02028 7.05601 8.69485C6.73057 8.36941 6.73057 7.84177 7.05601 7.51634Z"
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
