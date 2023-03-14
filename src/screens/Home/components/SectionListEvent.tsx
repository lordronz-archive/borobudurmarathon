import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import {Box, FlatList, Flex, Image, Spinner, Text, Toast} from 'native-base';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {EventService} from '../../../api/event.service';
import CategoryButton from '../../../components/buttons/CategoryButton';
import EventCard from '../../../components/card/EventCard';
import Section from '../../../components/section/Section';
import datetime from '../../../helpers/datetime';
import {getErrorMessage} from '../../../helpers/errorHandler';
import I18n from '../../../lib/i18n';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {
  EventProperties,
  EventPropertiesDetail,
  EVENT_TYPES,
} from '../../../types/event.type';

export default function SectionListEvent() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<EventProperties[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<string>('All Event');
  const [selectedEventCategory, setSelectedEventCategory] = useState<{
    id: number | null;
    value: string;
  }>();
  let filteredEvents = [...data];
  if (selectedEventCategory && selectedEventCategory.id) {
    filteredEvents = filteredEvents.filter(
      item => Number(item.evnhType) === Number(selectedEventCategory.id),
    );
  }

  const fetchList = () => {
    setIsLoading(true);
    EventService.getEvents()
      .then(res => {
        // console.info('res getEvents', JSON.stringify(res));
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

  const _renderItem = ({item}: {item: EventPropertiesDetail}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('EventDetail', {id: Number(item.evnhId)})
        }>
        <EventCard
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
          isAvailable={
            !moment(item.evnhRegistrationEnd, 'YYYY-MM-DD HH:mm:ss').isBefore(
              moment(),
            )
          }
        />
      </TouchableOpacity>
    );
  };

  const _renderEmpty = () => {
    return (
      <Flex my={5} flex={1}>
        <Image
          source={require('../../../assets/images/hiasan-not-found.png')}
          alignSelf={'center'}
          mb={1}
          alt="Data empty"
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
    <Section title={I18n.t('home.eventsTitle')} mt={1} _title={{py: 2, px: 4}}>
      <CategoryButton
        categories={[{id: null, value: 'All'}, ...Object.values(EVENT_TYPES)]}
        selected={selectedEventCategory?.id || null}
        style={{px: 4}}
        onSelect={cat => setSelectedEventCategory(cat)}
      />

      <FlatList
        refreshing={isLoading}
        data={filteredEvents}
        ListEmptyComponent={() =>
          isLoading ? (
            <Box height={100}>
              <Spinner />
            </Box>
          ) : (
            _renderEmpty()
          )
        }
        renderItem={_renderItem}
        keyExtractor={item => item.evnhId.toString()}
        _contentContainerStyle={{px: 4, py: 3}}
      />
    </Section>
  );
}
