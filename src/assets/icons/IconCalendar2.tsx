import React from 'react';
import {createIcon} from 'native-base';
import {Path} from 'react-native-svg';

export default function IconCalendar2(props: any) {
  const Icon = createIcon({
    viewBox: '0 0 16 16',
    path: [
      <Path
        d="M9.48164 1.33337V14.6667M2.07424 1.33337H13.9261C14.3352 1.33337 14.6668 1.66501 14.6668 2.07411V5.03708C13.4395 5.03708 12.4446 6.032 12.4446 7.2593C12.4446 8.4866 13.4395 9.48152 14.6668 9.48152V13.926C14.6668 14.3351 14.3352 14.6667 13.9261 14.6667H2.07424C1.66514 14.6667 1.3335 14.3351 1.3335 13.926L1.3335 9.48152C2.5608 9.48152 3.55572 8.4866 3.55572 7.2593C3.55572 6.032 2.5608 5.03708 1.3335 5.03708V2.07411C1.3335 1.66501 1.66514 1.33337 2.07424 1.33337Z"
        stroke="#768499"
        strokeWidth="1.77778"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />,
    ],
  });

  return <Icon {...props} />;
}
