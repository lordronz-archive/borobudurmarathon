import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Divider, FlatList, Toast} from 'native-base';
import React, {ComponentType, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {EventService} from '../../../api/event.service';
import CategoryButton from '../../../components/buttons/CategoryButton';
import MyEventCard from '../../../components/card/MyEventCard';
import Section from '../../../components/section/Section';
import datetime from '../../../helpers/datetime';
import {getErrorMessage} from '../../../helpers/errorHandler';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {EventProperties} from '../../../types/event.type';

export default function SectionListMyEvent() {
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
        <MyEventCard
          title={item.evnhName}
          place={item.evnhPlace || '-'}
          date={datetime.getDateRangeString(
            item.evnhStartDate,
            item.evnhEndDate,
            'short',
            'short',
          )}
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
    <Section title="Our Events" mt="1" _title={{py: 2, px: 4}}>
      <CategoryButton
        categories={[
          'All Event',
          'Active Event',
          'Past Event',
          'Offline',
          'Other',
        ]}
        selected={selectedCategory}
        style={{px: 4}}
        onSelect={cat => setSelectedCategory(cat)}
      />

      <FlatList
        refreshing={isLoading}
        data={data}
        renderItem={_renderItem}
        keyExtractor={item => item.evnhId.toString()}
        _contentContainerStyle={{px: 4, py: 3}}
        ItemSeparatorComponent={
          (
            <Divider
              my="2"
              _light={{
                bg: '#E8ECF3',
                height: '2px',
              }}
              _dark={{
                bg: 'muted.50',
              }}
            />
          ) as unknown as ComponentType<any>
        }
      />
    </Section>
  );
}
