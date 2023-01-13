import React from 'react';
import {Button as NBButton} from 'native-base';
import {type GestureResponderEvent} from 'react-native';

export type ButtonProps = {
  variant?: 'solid' | 'outline';
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  [key: string]: any;
};

export default function Button({
  onPress,
  children,
  variant = 'solid',
  ...rest
}: ButtonProps) {
  return (
    <NBButton
      onPress={onPress}
      variant={variant}
      borderColor={'#EB1C23'}
      borderRadius={8}
      bgColor={variant === 'solid' ? '#EB1C23' : 'white'}
      _text={{
        color: variant === 'solid' ? 'white' : '#EB1C23',
      }}
      {...rest}>
      {children}
    </NBButton>
  );
}
