import React from 'react';
import {Icon} from 'native-base';
import {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';

export default function IconCircleX({size = '4xl'}: {size?: string | number}) {
  return (
    <Icon
      width="95"
      height="96"
      viewBox="0 0 95 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      size={size}>
      <G clipPath="url(#clip0_887_7285)">
        <Path
          d="M47.7539 95.5C73.7113 95.5 94.7539 74.2335 94.7539 48C94.7539 21.7665 73.7113 0.5 47.7539 0.5C21.7965 0.5 0.753906 21.7665 0.753906 48C0.753906 74.2335 21.7965 95.5 47.7539 95.5Z"
          fill="#FDEBEB"
        />
        <Path
          d="M47.7539 83.7286C67.2785 83.7286 83.1064 67.7323 83.1064 48C83.1064 28.2676 67.2785 12.2714 47.7539 12.2714C28.2292 12.2714 12.4014 28.2676 12.4014 48C12.4014 67.7323 28.2292 83.7286 47.7539 83.7286Z"
          fill="#FFB5B5"
        />
        <Path
          d="M47.7539 75.2773C62.6601 75.2773 74.7441 63.0649 74.7441 48C74.7441 32.9352 62.6601 20.7227 47.7539 20.7227C32.8476 20.7227 20.7637 32.9352 20.7637 48C20.7637 63.0649 32.8476 75.2773 47.7539 75.2773Z"
          fill="#FE4545"
        />
        <Path
          d="M54.5981 41.0832C51.9254 43.7844 49.8397 45.8922 47.7541 48M40.9102 54.9168C43.5829 52.2156 45.6685 50.1078 47.7541 48M47.7541 48L54.5981 54.9168M47.7541 48L40.9102 41.0832"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_887_7285">
          <Rect
            width="94"
            height="95"
            fill="white"
            transform="translate(0.753906 0.5)"
          />
        </ClipPath>
      </Defs>
    </Icon>
  );
}
