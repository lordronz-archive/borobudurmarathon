import {useNavigation} from '@react-navigation/native';
import {Box, Text, VStack, ScrollView, Divider, Image} from 'native-base';
import React from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import SectionListMyEvent from './components/SectionListMyEvent';

export default function MyEvents() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView>
      <VStack space="4" pb="3">
        <Image
          borderRadius={8}
          source={require('../../assets/images/welcome-card-img.png')}
          alt="Alternate Text"
          top="0"
          right="0"
          position="absolute"
        />
        <Box px="4">
          <BackHeader onPress={() => navigation.goBack()} />
          <VStack space="1.5">
            <Heading>My Events</Heading>
            <Text fontWeight={400} color="#768499" fontSize={11}>
              All of my borobudur marathon events
            </Text>
          </VStack>
        </Box>
        <Divider
          my="2"
          _light={{
            bg: '#E8ECF3',
            height: '8px',
          }}
          _dark={{
            bg: 'muted.50',
          }}
        />
        <SectionListMyEvent />
      </VStack>
    </ScrollView>
  );
}
