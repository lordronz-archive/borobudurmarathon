import {FlatList, Toast} from 'native-base';
import React, {useEffect, useState} from 'react';
import {EventService} from '../../../api/event.service';
import CategoryButton from '../../../components/buttons/CategoryButton';
import EventCard from '../../../components/card/EventCard';
import Section from '../../../components/section/Section';
import {getErrorMessage} from '../../../helpers/errorHandler';
import {EventProperties} from '../../../types/event.type';

export default function SectionListEvent() {
  const [data, setData] = useState<EventProperties[]>([]);

  const fetchList = () => {
    EventService.getEvents()
      .then(res => {
        console.info('res getEvents', JSON.stringify(res));
        if (res.data) {
          setData(res.data);
        }
      })
      .catch(err => {
        Toast.show({
          title: 'Failed to get event',
          description: getErrorMessage(err),
        });
      });
  };

  useEffect(() => {
    fetchList();
  }, []);

  const _renderItem = ({item}: {item: EventProperties}) => {
    return (
      <EventCard
        title={item.evnhName}
        place={item.evnhPlace || '-'}
        date={item.evnhStartDate + ' ' + item.evnhEndDate}
        image={require('../../../assets/images/FeaturedEventImage.png')}
        isAvailable={false}
      />
    );
  };

  return (
    <Section title="Our Events" mx="4" mr="-4">
      <CategoryButton
        categories={['All Event', 'Offline', 'Race', 'V', 'Other']}
      />

      <FlatList
        data={data}
        renderItem={_renderItem}
        keyExtractor={item => item.evnhId.toString()}
      />
    </Section>
  );
}
