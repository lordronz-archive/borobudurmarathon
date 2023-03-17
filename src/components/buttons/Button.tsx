import {Spinner} from 'native-base';
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
  style?: any;
  [key: string]: any;
};

export default function Button({
  onPress,
  children,
  variant = 'solid',
  _text,
  isLoading,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const renderChildren = () =>
    isLoading ? (
      <View style={{flexDirection: 'row'}}>
        <Spinner size="sm" color="white" />
      </View>
    ) : typeof children === 'string' ? (
      <Text
        style={{
          color: variant === 'solid' ? 'white' : '#EB1C23',
          ..._text,
        }}>
        {children}
      </Text>
    ) : (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {children}
      </View>
    );
  if (isLoading || disabled) {
    return (
      <View
        style={[
          {
            flex: 1,
            borderColor: '#f2f2f2',
            backgroundColor: variant === 'solid' ? 'gray' : 'white',
          },
          {
            padding: 14,
            borderRadius: 8,
            alignItems: typeof children === 'string' ? 'center' : undefined,
          },
          style,
        ]}>
        {renderChildren()}
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          {
            flex: 1,
            borderColor: '#C5CDDB',
            backgroundColor: variant === 'solid' ? '#EB1C23' : 'white',
          },
          {
            padding: 14,
            borderRadius: 8,
            alignItems: typeof children === 'string' ? 'center' : 'center',
          },
          style,
        ]}>
        {renderChildren()}
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
