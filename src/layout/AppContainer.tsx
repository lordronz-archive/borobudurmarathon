import React from 'react';
import {View} from 'react-native';

type Props = {
  style?: any;
  backgroundColor?: any;
  children: any;
};

export default function AppContainer(props: Props) {
  return (
    <View
      style={[
        props.style,
        {
          flex: 1,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : '#FFFFFF',
        },
      ]}>
      {props.children}
    </View>
  );
}
