import {Icon} from 'native-base';
import {G, Path} from 'react-native-svg';
import React from 'react';

type CalendarIconProps = {
  size?: string;
  px?: string;
};

export default function CalendarIcon({size = '4xl', px}: CalendarIconProps) {
  return (
    <Icon size={size} viewBox="0 0 18 18" px={px}>
      <G fillRule="nonzero" stroke="none" strokeWidth={1} fill="none">
        <Path
          d="M1.00745 6.66667H14.3408M11.0074 1.66667V3.33333M4.34078 1.66667V3.33333M1.84078 3.33333H13.5074C13.9677 3.33333 14.3408 3.70643 14.3408 4.16667V15.8333C14.3408 16.2936 13.9677 16.6667 13.5074 16.6667H1.84078C1.38054 16.6667 1.00745 16.2936 1.00745 15.8333V4.16667C1.00745 3.70643 1.38054 3.33333 1.84078 3.33333Z"
          stroke="#768499"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </G>
    </Icon>
  );
}
