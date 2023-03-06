import React from 'react';
import {Icon} from 'native-base';
import {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';

export default function IconUpload({size = '5xl'}: {size?: string | number}) {
  return (
    <Icon
      width="69"
      height="69"
      viewBox="0 0 69 69"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      size={size}>
      <Rect
        x="12.0332"
        y="12.5"
        width="44"
        height="44"
        rx="22"
        fill="#FE4545"
      />
      <G clipPath="url(#clip0_861_6314)">
        <Path
          d="M34.0329 37.8333V32.8333M34.0329 32.8333L31.5329 34.5M34.0329 32.8333L36.5329 34.5M39.8662 40.3333C41.7072 40.3333 43.1995 38.8409 43.1995 37C43.1995 35.159 41.7072 33.6667 39.8662 33.6667C39.8465 33.6667 39.8268 33.6668 39.8072 33.6672C39.4031 30.84 36.9718 28.6667 34.0329 28.6667C31.7023 28.6667 29.691 30.0334 28.7566 32.009C26.5842 32.1512 24.8662 33.9583 24.8662 36.1667C24.8662 38.4678 26.7317 40.3333 29.0329 40.3333H39.8662Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>
      <Rect
        x="6.0332"
        y="6.5"
        width="56"
        height="56"
        rx="28"
        stroke="#FE4545"
        strokeOpacity="0.1"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <Defs>
        <ClipPath id="clip0_861_6314">
          <Rect
            width="20"
            height="20"
            fill="white"
            transform="translate(24.0332 24.5)"
          />
        </ClipPath>
      </Defs>
    </Icon>
  );
}
