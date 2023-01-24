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
  _text,
  ...rest
}: ButtonProps) {
  return (
    <NBButton
      onPress={onPress}
      variant={variant}
      borderColor={'#C5CDDB'}
      borderRadius={8}
      bgColor={variant === 'solid' ? '#EB1C23' : 'white'}
      _text={{
        color: variant === 'solid' ? 'white' : '#EB1C23',
        ..._text,
      }}
      {...rest}>
      {children}
    </NBButton>
  );
}
