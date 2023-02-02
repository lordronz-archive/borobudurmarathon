import {useNavigation} from '@react-navigation/native';
import {
  Box,
  Text,
  VStack,
  useTheme,
  ScrollView,
  Divider,
  Image,
} from 'native-base';
import React from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import BestRecord from './components/BestRecord';
import Statistic from './components/Statistic';
import SectionListMyEvents from './components/SectionListMyEvents';

export default function MyEvents() {
  const {colors} = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView backgroundColor={colors.white} flex={1}>
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
          <Heading>Records</Heading>
          <Text fontWeight={400} color="#768499" fontSize={11}>
            Best record from all my running event
          </Text>
        </VStack>
      </Box>
      <BestRecord />
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
      <Statistic />
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
      <SectionListMyEvents />
    </ScrollView>
  );
}
