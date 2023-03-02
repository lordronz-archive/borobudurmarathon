import React from 'react';
import {Icon} from 'native-base';
import {ClipPath, Defs, G, Rect} from 'react-native-svg';

export default function IconIndonesia({
  size = '5xl',
}: {
  size?: string | number;
}) {
  return (
    <Icon
      width="83"
      height="52"
      viewBox="0 0 83 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      size={size}>
      <G clipPath="url(#clip0_873_6491)">
        <Rect
          x="0.581055"
          y="0.102783"
          width="82"
          height="25.5"
          fill="#EB1C23"
        />
        <Rect
          x="0.581055"
          y="25.6028"
          width="82"
          height="25.5"
          fill="#F4F6F9"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_873_6491">
          <Rect
            x="0.581055"
            y="0.102783"
            width="82"
            height="51"
            rx="4"
            fill="white"
          />
        </ClipPath>
      </Defs>
    </Icon>
  );
}
