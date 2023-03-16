import React from 'react';
// import {Button as NBButton} from 'native-base';
import {
  type GestureResponderEvent,
  // Button as NBButton,
  TouchableOpacity,
  Text,
} from 'react-native';

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
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: variant === 'solid' ? '#EB1C23' : 'white',
        padding: 14,
        borderRadius: 8,
        borderColor: '#C5CDDB',
        alignItems: typeof children === 'string' ? 'center' : undefined,
      }}>
      {typeof children === 'string' ? (
        <Text
          style={{color: variant === 'solid' ? 'white' : '#EB1C23', ..._text}}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
  // return (
  //   <NBButton
  //     title={typeof children === 'string' ? children : 'Next'}
  //     onPress={onPress}
  //     // variant={variant}
  //     // borderColor={'#C5CDDB'}
  //     // borderRadius={8}
  //     // bgColor={variant === 'solid' ? '#EB1C23' : 'white'}
  //     // _text={{
  //     //   color: variant === 'solid' ? 'white' : '#EB1C23',
  //     //   ..._text,
  //     // }}
  //     {...rest}
  //   />
  // );
}
