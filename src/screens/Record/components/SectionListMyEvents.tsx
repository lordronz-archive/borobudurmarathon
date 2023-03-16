import React, {useEffect} from 'react';
import {View, Flex, Image, Text, FlatList, Spinner} from 'native-base';
import Section from '../../../components/section/Section';
import RecordCard from './RecordCard';
import {Datum} from '../../../types/activity.type';
import {useTranslation} from 'react-i18next';
import useActivity from '../../../hooks/useActivities';

export default function SectionListMyEvents() {
  const {t} = useTranslation();

  const {isLoading, activities, fetchList} = useActivity();

  useEffect(() => {
    fetchList();
  }, []);

  const _renderItem = ({item: activity}: {item: Datum}) => {
    return (
      <RecordCard
        time={`${activity.mmacTimeHour
          .toString()
          .padStart(2, '0')}:${activity.mmacTimeMinute
          .toString()
          .padStart(2, '0')}:${activity.mmacTimeSecond
          .toString()
          .padStart(2, '0')}`}
        distanceInKm={activity.mmacDistance}
        averagePacePerKm={activity.averagePace || ''}
      />
    );
  };

  const _renderEmpty = () => {
    return isLoading ? (
      <Spinner size="lg" />
    ) : (
      <Flex my={5} flex={1}>
        <Image
          source={require('../../../assets/images/hiasan-not-found.png')}
          alignSelf={'center'}
          mb={1}
          alt="Empty data"
        />
        <Text textAlign={'center'} fontSize={'lg'} fontWeight={'bold'} mb={1}>
          {t('dataEmpty')}
        </Text>
        <Text textAlign={'center'} fontSize={'sm'} color={'gray.400'}>
          {t('dataEmptyDesc')}
        </Text>
      </Flex>
    );
  };

  return (
    <View p="4">
      <Section
        title="My Borobudur Marathon Events"
        subtitle="All records of my borobudur marathon events">
        <FlatList
          refreshing={isLoading}
          data={activities}
          ListEmptyComponent={_renderEmpty}
          renderItem={_renderItem}
          keyExtractor={item => item.mmacId.toString()}
          ItemSeparatorComponent={() => <View h="20px" />}
        />
      </Section>
    </View>
  );
}
