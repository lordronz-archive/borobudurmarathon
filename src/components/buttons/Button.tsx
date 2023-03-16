import { Spinner } from 'native-base';
import React from 'react';
// import {Button as NBButton} from 'native-base';
import {
  type GestureResponderEvent,
  // Button as NBButton,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

export type ButtonProps = {
  variant?: 'solid' | 'outline';
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  isLoading?: boolean;
  disabled?: boolean;
  [key: string]: any;
};

export default function Button({
  onPress,
  children,
  variant = 'solid',
  _text,
  isLoading,
  disabled,
  ...rest
}: ButtonProps) {
  if (isLoading || disabled) {
    return (
      <View
        style={[
          {
            borderColor: '#f2f2f2',
            backgroundColor: variant === 'solid' ? 'gray' : 'white',
          },
          {
            padding: 14,
            borderRadius: 8,
            alignItems: typeof children === 'string' ? 'center' : undefined,
          },
        ]}>
        {typeof children === 'string' ? (
          <Text
            style={{
              color: variant === 'solid' ? 'white' : '#EB1C23',
              ..._text,
            }}>
            {children}
          </Text>
        ) : (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {isLoading ? <Spinner /> : false}
            {children}
          </View>
        )}
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          {
            borderColor: '#C5CDDB',
            backgroundColor: variant === 'solid' ? '#EB1C23' : 'white',
          },
          {
            padding: 14,
            borderRadius: 8,
            alignItems: typeof children === 'string' ? 'center' : 'center',
          },
        ]}>
        {typeof children === 'string' ? (
          <Text
            style={{
              color: variant === 'solid' ? 'white' : '#EB1C23',
              ..._text,
            }}>
            {children}
          </Text>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {isLoading ? <Spinner /> : false}
            {children}
          </View>
        )}
      </TouchableOpacity>
    );
  }
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
