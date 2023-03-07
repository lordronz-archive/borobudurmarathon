import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconMore(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 17 4',
    path: [
      <Path
        d="M13.4844 2C13.4844 1.44772 13.9321 1 14.4844 1C15.0367 1 15.4844 1.44772 15.4844 2C15.4844 2.55228 15.0367 3 14.4844 3C13.9321 3 13.4844 2.55228 13.4844 2Z"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="currentColor"
      />,
      <Path
        d="M7.48438 2C7.48438 1.44772 7.93209 1 8.48438 1C9.03666 1 9.48438 1.44772 9.48438 2C9.48438 2.55228 9.03666 3 8.48438 3C7.93209 3 7.48438 2.55228 7.48438 2Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />,
      <Path
        d="M1.48438 2C1.48438 1.44772 1.93209 1 2.48438 1C3.03666 1 3.48438 1.44772 3.48438 2C3.48438 2.55228 3.03666 3 2.48438 3C1.93209 3 1.48438 2.55228 1.48438 2Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />,
    ],
  });

  return <Icon {...props} />;
}
