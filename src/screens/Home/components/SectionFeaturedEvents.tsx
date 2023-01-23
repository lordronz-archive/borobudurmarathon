import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Toast} from 'native-base';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {EventService} from '../../../api/event.service';
import EventCard from '../../../components/card/EventCard';
import BannerNew from '../../../components/carousel/BannerNew';
import Section from '../../../components/section/Section';
import {getErrorMessage} from '../../../helpers/errorHandler';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {EventProperties} from '../../../types/event.type';

export default function SectionFeaturedEvents() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<EventProperties[]>([]);

  const fetchList = () => {
    setIsLoading(true);
    EventService.getEvents()
      .then(res => {
        console.info('res getEvents', JSON.stringify(res));
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

  const _renderItem = ({item}: {item: EventProperties}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('EventDetail', {id: item.evnhId})}>
        <EventCard
          title={item.evnhName}
          place={item.evnhPlace || '-'}
          date={item.evnhStartDate + ' ' + item.evnhEndDate}
          image={
            item.evnhThumbnail
              ? {uri: item.evnhThumbnail}
              : require('../../../assets/images/FeaturedEventImage.png')
          }
          isAvailable={false}
        />
      </TouchableOpacity>
    );
  };

  if (data.length === 0) {
    return <></>;
  }

  return (
    <Section title="Featured Events" _title={{py: 2, px: 4}}>
      <BannerNew entries={[{}, {}, {}]} />
      {/* <FlatList
        refreshing={isLoading}
        data={data}
        renderItem={_renderItem}
        keyExtractor={item => item.evnhId.toString()}
      /> */}
    </Section>
  );
}
