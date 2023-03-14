import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Toast} from 'native-base';
import React, {useEffect, useState} from 'react';
import {EventService} from '../../../api/event.service';
import BannerNew from '../../../components/carousel/BannerNew';
import Section from '../../../components/section/Section';
import datetime from '../../../helpers/datetime';
import {getErrorMessage} from '../../../helpers/errorHandler';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {EventProperties, EVENT_TYPES} from '../../../types/event.type';

export default function SectionFeaturedEvents() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<EventProperties[]>([]);

  const fetchList = () => {
    setIsLoading(true);
    EventService.getEvents(true)
      .then(res => {
        // console.info('res getEvents', JSON.stringify(res));
        if (res.data) {
          setData(res.data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        Toast.show({
          title: 'Failed to get featured events',
          description: getErrorMessage(err),
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (data.length === 0) {
    return <></>;
  }

  return (
    <Section title="Featured Events" _title={{py: 2, px: 4}}>
      <BannerNew
        entries={data.map(item => ({
          title: item.evnhName,
          eventType: EVENT_TYPES[item.evnhType]?.value || 'Other',
          date: datetime.getDateRangeString(
            item.evnhStartDate,
            item.evnhEndDate,
            'short',
            'short',
          ),
          imageUrl: item.evnhThumbnail,
          id: item.evnhId,
        }))}
      />
    </Section>
  );
}
