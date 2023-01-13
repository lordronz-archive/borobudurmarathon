import {Text} from 'native-base';
import React from 'react';

type HeadingProps = {
  children: React.ReactNode;
  [key: string]: any;
};

export function Heading({children, ...rest}: HeadingProps) {
  return (
    <Text fontSize="2xl" fontWeight={600} {...rest}>
      {children}
    </Text>
  );
}
