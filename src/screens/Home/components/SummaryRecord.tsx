import React, {useEffect} from 'react';
import {Flex, VStack, Divider, Text} from 'native-base';
import useActivity from '../../../hooks/useActivities';

export default function SummaryRecord() {
  const {fetchList, bestRecord} = useActivity();

  useEffect(() => {
    fetchList();
  }, []);

  if (!bestRecord) {
    return <></>;
  }

  return (
    <Flex mx="3" direction="row" justify="space-evenly" alignItems={'center'}>
      <VStack alignItems="center">
        <Text py="2" color={'#768499'} fontSize={12}>
          Time
        </Text>
        <Text py="1" fontWeight={500} fontSize={18}>
          {`${bestRecord.mmacTimeHour
            .toString()
            .padStart(2, '0')}:${bestRecord.mmacTimeMinute
            .toString()
            .padStart(2, '0')}:${bestRecord.mmacTimeSecond
            .toString()
            .padStart(2, '0')}`}
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
      <VStack alignItems="center">
        <Text py="2" color={'#768499'} fontSize={12}>
          Distance
        </Text>
        <Text py="1" fontWeight={500} fontSize={18}>
          {bestRecord.mmacDistance}{' '}
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
      <VStack alignItems="center">
        <Text py="2" color={'#768499'} fontSize={12}>
          Pace
        </Text>
        <Text py="1" fontWeight={500} fontSize={18}>
          {bestRecord.averagePace}
          <Text fontWeight={600} color={'#768499'} fontSize={12}>
            /km
          </Text>
        </Text>
      </VStack>
    </Flex>
  );
}
