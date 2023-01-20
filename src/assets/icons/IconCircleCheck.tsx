import React from 'react';
import {Icon} from 'native-base';
import {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';

export default function IconCircleCheck({
  size = '4xl',
}: {
  size?: string | number;
}) {
  return (
    <Icon
      width="94"
      height="96"
      viewBox="0 0 94 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      size={size}>
      <G>
        <Path
          d="M47 95.5C72.9574 95.5 94 74.2335 94 48C94 21.7665 72.9574 0.5 47 0.5C21.0426 0.5 0 21.7665 0 48C0 74.2335 21.0426 95.5 47 95.5Z"
          fill="#DFF4E0"
        />
        <Path
          d="M47 83.7286C66.5246 83.7286 82.3525 67.7323 82.3525 48C82.3525 28.2676 66.5246 12.2714 47 12.2714C27.4753 12.2714 11.6475 28.2676 11.6475 48C11.6475 67.7323 27.4753 83.7286 47 83.7286Z"
          fill="#B4EFB6"
        />
        <Path
          d="M47 75.2773C61.9062 75.2773 73.9902 63.0649 73.9902 48C73.9902 32.9352 61.9062 20.7227 47 20.7227C32.0937 20.7227 20.0098 32.9352 20.0098 48C20.0098 63.0649 32.0937 75.2773 47 75.2773Z"
          fill="#55C95A"
        />
        <Path
          d="M57.2658 41.0832C51.9203 46.4856 48.9233 49.5144 43.5779 54.9168L36.7339 48"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_86_3434" />
        <Rect
          width="94"
          height="95"
          fill="white"
          transform="translate(0 0.5)"
        />
      </Defs>
    </Icon>
  );
}
