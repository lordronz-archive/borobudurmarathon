import React from 'react';
import {View, Text} from 'react-native';
import useInit from '../../hooks/useInit';

export default function HomeScreen() {
  const _init = useInit();

  return (
    <View style={{width: 100, backgroundColor: 'red', height: 100}}>
      <Text style={{color: 'black'}}>Home Screen</Text>
    </View>
  );
}
