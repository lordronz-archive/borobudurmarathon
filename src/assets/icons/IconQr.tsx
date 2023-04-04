import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconQr(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 19 18',
    path: [
      <Path
        d="M16.6562 17H17.6562M13.6562 17H11.6562V14M14.6562 14H17.6562V11H16.6562M11.6562 11H13.6562M2.65625 11H6.65625C7.20853 11 7.65625 11.4477 7.65625 12V16C7.65625 16.5523 7.20853 17 6.65625 17H2.65625C2.10397 17 1.65625 16.5523 1.65625 16V12C1.65625 11.4477 2.10397 11 2.65625 11ZM12.6562 1H16.6562C17.2085 1 17.6562 1.44772 17.6562 2V6C17.6562 6.55228 17.2085 7 16.6562 7H12.6562C12.104 7 11.6562 6.55228 11.6562 6V2C11.6562 1.44772 12.104 1 12.6562 1ZM2.65625 1H6.65625C7.20853 1 7.65625 1.44772 7.65625 2V6C7.65625 6.55228 7.20853 7 6.65625 7H2.65625C2.10397 7 1.65625 6.55228 1.65625 6V2C1.65625 1.44772 2.10397 1 2.65625 1Z"
        stroke={props.stroke || '#768499'}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />,
    ],
  });

  return <Icon {...props} />;
}
