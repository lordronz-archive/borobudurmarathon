import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import {Box, FlatList, Flex, Image, Spinner, Text} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import CategoryButton from '../../../components/buttons/CategoryButton';
import EventCard from '../../../components/card/EventCard';
import Section from '../../../components/section/Section';
import datetime from '../../../helpers/datetime';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import useEvent from '../../../hooks/useEvent';
import {EventPropertiesDetail, EVENT_TYPES} from '../../../types/event.type';
import { getEventRegistrationStatus } from '../../../helpers/eventStatus';

export default function SectionListEvent() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();
  const {isLoading, events, fetchList} = useEvent();
  // const [selectedCategory, setSelectedCategory] = useState<string>('All Event');
  const [selectedEventCategory, setSelectedEventCategory] = useState<{
    id: number | null;
    value: string;
  }>();
  let filteredEvents = [...events];
  if (selectedEventCategory && selectedEventCategory.id) {
    filteredEvents = filteredEvents.filter(
      item => Number(item.evnhType) === Number(selectedEventCategory.id),
    );
  }
  // console.info('filteredEvents', JSON.stringify(filteredEvents));

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
              : require('../../../assets/images/no-image.png')
          }
          status={getEventRegistrationStatus(
            item.evnhRegistrationStart,
            item.evnhRegistrationEnd,
          )}
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
          {t('dataEmpty')}
        </Text>
        <Text textAlign={'center'} fontSize={'sm'} color={'gray.400'}>
          {t('dataEmptyDesc')}
        </Text>
      </Flex>
    );
  };

  return (
    <Section title={t('home.eventsTitle')} mt={1} _title={{py: 2, px: 4}}>
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
