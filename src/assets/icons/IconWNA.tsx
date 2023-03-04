import React from 'react';
import {Icon} from 'native-base';
import {Path, Rect} from 'react-native-svg';

export default function IconWNA({size = '5xl'}: {size?: string | number}) {
  return (
    <Icon
      width="83"
      height="52"
      viewBox="0 0 83 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      size={size}>
      <Rect
        x="0.581055"
        y="0.602783"
        width="82"
        height="51"
        rx="4"
        fill="#20A1F5"
      />
      <Path
        d="M55.0811 26.1028C55.0811 33.5586 49.0369 39.6028 41.5811 39.6028M55.0811 26.1028C55.0811 18.6469 49.0369 12.6028 41.5811 12.6028M55.0811 26.1028H28.0811M41.5811 39.6028C34.1252 39.6028 28.0811 33.5586 28.0811 26.1028M41.5811 39.6028C44.0663 39.6028 46.0811 33.5586 46.0811 26.1028C46.0811 18.6469 44.0663 12.6028 41.5811 12.6028M41.5811 39.6028C39.0958 39.6028 37.0811 33.5586 37.0811 26.1028C37.0811 18.6469 39.0958 12.6028 41.5811 12.6028M28.0811 26.1028C28.0811 18.6469 34.1252 12.6028 41.5811 12.6028"
        stroke="white"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Icon>
  );
}
