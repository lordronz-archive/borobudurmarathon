import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FlatList, Spinner, Toast} from 'native-base';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {EventService} from '../../../api/event.service';
import CategoryButton from '../../../components/buttons/CategoryButton';
import EventCard from '../../../components/card/EventCard';
import Section from '../../../components/section/Section';
import {getErrorMessage} from '../../../helpers/errorHandler';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {EventProperties} from '../../../types/event.type';

export default function SectionListEvent() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<EventProperties[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Event');

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
          title: 'Failed to get events',
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

  return (
    <Section title="Our Events" mt="5" _title={{py: 2, px: 4}}>
      <CategoryButton
        categories={['All Event', 'Offline', 'Race', 'Vace', 'Other']}
        selected={selectedCategory}
        style={{px: 4, pb: 2}}
        onSelect={cat => setSelectedCategory(cat)}
      />

      <FlatList
        refreshing={isLoading}
        data={data}
        renderItem={_renderItem}
        keyExtractor={item => item.evnhId.toString()}
        _contentContainerStyle={{px: 4}}
      />
    </Section>
  );
}
