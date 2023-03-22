import {View, Image, Text} from 'native-base';
import React from 'react';

export default function ComingSoon() {
  return (
    <View flex={1} justifyContent="center" alignItems="center" bg="white">
      <Image
        source={require('../assets/images/hiasan-not-found.png')}
        alignSelf={'center'}
        mb={1}
        alt="Coming soon"
      />
      <Text textAlign={'center'} fontSize={'lg'} fontWeight={'bold'} mb={1}>
        Coming Soon
      </Text>
    </View>
  );
}
