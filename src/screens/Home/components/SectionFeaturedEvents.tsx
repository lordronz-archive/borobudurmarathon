import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {EventService} from '../../../api/event.service';
import BannerNew from '../../../components/carousel/BannerNew';
import Section from '../../../components/section/Section';
import datetime from '../../../helpers/datetime';
import { getEventTypeName } from '../../../helpers/event';
import useEvent from '../../../hooks/useEvent';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {EventProperties, EVENT_TYPES} from '../../../types/event.type';

export default function SectionFeaturedEvents() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const {featuredEvents} = useEvent();
  // const [data, setData] = useState<EventProperties[]>([]);

  // const fetchList = () => {
  // setIsLoading(true);
  // EventService.getEvents(true)
  //   .then(res => {
  //     // console.info('res getEvents', JSON.stringify(res));
  //     if (res.data) {
  //       setData(res.data);
  //     }
  //     setIsLoading(false);
  //   })
  //   .catch(err => {
  //     console.info('error fetch featured events', err);
  //     // Toast.show({
  //     //   title: 'Failed to get featured events',
  //     //   description: getErrorMessage(err),
  //     // });
  //     setIsLoading(false);
  //   });
  // };

  const {t} = useTranslation();

  // useEffect(() => {
  //   fetchListFeaturedEvents();
  // }, []);

  if (featuredEvents.length === 0) {
    return <></>;
  }

  return (
    <Section title={t('event.featuredEvents')} _title={{py: 2, px: 4}}>
      <BannerNew
        entries={featuredEvents.map(item => ({
          title: item.evnhName || '',
          eventType: getEventTypeName({
            evnhType: item.evnhType,
            evnhBallot: item.evnhBallot,
          }),
          date: datetime.getDateRangeString(
            item.evnhStartDate,
            item.evnhEndDate,
            'short',
            'short',
          ),
          imageUrl:
            item.eimgEvnhId && item.eimgEvnhId.length > 0
              ? item.eimgEvnhId[0].eimgUrlImage
              : undefined,
          id: item.evnhId,
        }))}
      />
    </Section>
  );
}
