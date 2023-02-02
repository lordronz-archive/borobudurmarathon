import React from 'react';
import {Flex, VStack, Divider, Text, HStack} from 'native-base';
import IconRun from '../../../assets/icons/IconRun';
import IconTimer from '../../../assets/icons/IconTimer';
import IconMap from '../../../assets/icons/IconMap';

export default function BestRecord() {
  return (
    <Flex
      mx="3"
      direction="row"
      justify="space-evenly"
      alignItems={'center'}
      py="2">
      <VStack alignItems="flex-start">
        <HStack alignItems={'center'} space="1">
          <IconTimer />
          <Text py="2" color={'#768499'} fontSize={12}>
            Time
          </Text>
        </HStack>
        <Text py="1" fontWeight={500} fontSize={18}>
          00:00:00
        </Text>
      </VStack>
      <Divider
        orientation="vertical"
        mx="3"
        h={12}
        _light={{
          bg: 'muted.300',
        }}
        _dark={{
          bg: 'muted.50',
        }}
      />
      <VStack alignItems="flex-start">
        <HStack alignItems={'center'} space="1">
          <IconMap />
          <Text py="2" color={'#768499'} fontSize={12}>
            Distance
          </Text>
        </HStack>
        <Text py="1" fontWeight={500} fontSize={18}>
          0{' '}
          <Text fontWeight={600} color={'#768499'} fontSize={12}>
            km
          </Text>
        </Text>
      </VStack>
      <Divider
        orientation="vertical"
        h={12}
        mx="3"
        _light={{
          bg: 'muted.300',
        }}
        _dark={{
          bg: 'muted.50',
        }}
      />
      <VStack alignItems="flex-start">
        <HStack alignItems={'center'} space="1">
          <IconRun />
          <Text py="2" color={'#768499'} fontSize={12}>
            Avg. Pace
          </Text>
        </HStack>
        <Text py="1" fontWeight={500} fontSize={18}>
          00:00
          <Text fontWeight={600} color={'#768499'} fontSize={12}>
            /km
          </Text>
        </Text>
      </VStack>
    </Flex>
  );
}
