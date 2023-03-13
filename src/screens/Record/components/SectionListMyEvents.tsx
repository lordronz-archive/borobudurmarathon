import React, {useEffect, useState} from 'react';
import {View, Flex, Image, Text, FlatList} from 'native-base';
import Section from '../../../components/section/Section';
import RecordCard from './RecordCard';
import {useAuthUser} from '../../../context/auth.context';
import {EventService} from '../../../api/event.service';
import {Activity, Datum} from '../../../types/activity.type';
import {averagePace} from '../../../helpers/averagePace';
import I18n from '../../../lib/i18n';

export default function SectionListMyEvents() {
  const {user} = useAuthUser();

  const [activities, setActivities] = useState<Activity>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      (async () => {
        console.info('Fetch activities');
        const res: any = await EventService.getGarminActivities('28328');
        setActivities(res.data);
        setIsLoading(false);
      })();
    }
  }, [user]);

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
        averagePacePerKm={averagePace(
          activity.mmacTimeHour,
          activity.mmacTimeMinute,
          activity.mmacTimeSecond,
          activity.mmacDistance,
        )}
      />
    );
  };

  const _renderEmpty = () => {
    return (
      <Flex my={5} flex={1}>
        <Image
          source={require('../../../assets/images/hiasan-not-found.png')}
          alignSelf={'center'}
          mb={1}
          alt="Empty data"
        />
        <Text textAlign={'center'} fontSize={'lg'} fontWeight={'bold'} mb={1}>
          {I18n.t('dataEmpty')}
        </Text>
        <Text textAlign={'center'} fontSize={'sm'} color={'gray.400'}>
          {I18n.t('dataEmptyDesc')}
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
          data={activities?.data}
          ListEmptyComponent={_renderEmpty}
          renderItem={_renderItem}
          keyExtractor={item => item.mmacId.toString()}
          ItemSeparatorComponent={() => <View h="20px" />}
        />
      </Section>
    </View>
  );
}
