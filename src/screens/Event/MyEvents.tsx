import React from 'react';
import {Box, Text} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';

export default function MyEvents() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Box>
      <Text>My Events</Text>
      <TouchableOpacity onPress={() => navigation.navigate('DetailEvent')}>
        <Text>Next</Text>
      </TouchableOpacity>
    </Box>
  );
}
