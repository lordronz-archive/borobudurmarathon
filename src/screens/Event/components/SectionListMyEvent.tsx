import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import {Divider, FlatList, Toast} from 'native-base';
import React, {ComponentType, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {EventService} from '../../../api/event.service';
import CategoryButton from '../../../components/buttons/CategoryButton';
import MyEventCard from '../../../components/card/MyEventCard';
import Section from '../../../components/section/Section';
import {getErrorMessage} from '../../../helpers/errorHandler';
import httpRequest from '../../../helpers/httpRequest';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {Datum, EventProperties, Transaction} from '../../../types/event.type';

enum CategoryEnum {
  ALL = 0,
  ACTIVE,
  VIRTUAL,
  PAST,
  OFFLINE,
  RACE,
  ELITE_RUNNER,
  TILIK_CANDI,
  YOUNG_TALENT,
  FRIENDSHIP_RUN,
}

const EVENT_TYPES = {
  [CategoryEnum.ACTIVE]: {
    id: CategoryEnum.ACTIVE,
    value: 'Active',
  },
  [CategoryEnum.PAST]: {
    id: CategoryEnum.PAST,
    value: 'Past',
  },
  [CategoryEnum.OFFLINE]: {
    id: CategoryEnum.OFFLINE,
    value: 'Offline',
  },
  [CategoryEnum.RACE]: {
    id: CategoryEnum.RACE,
    value: 'Race',
  },
  [CategoryEnum.VIRTUAL]: {
    id: CategoryEnum.VIRTUAL,
    value: 'Virtual',
  },
  [CategoryEnum.ELITE_RUNNER]: {
    id: CategoryEnum.ELITE_RUNNER,
    value: 'Elite Runner',
  },
};

export default function SectionListMyEvent() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Transaction>();
  const [eventL, setEvent] = useState<EventProperties[]>([]);
  let filteredEvents = [...(eventL || [])];
  let filteredData = [...(data?.data || [])];
  const [selectedCategory, setSelectedCategory] = useState<{
    id: CategoryEnum | null;
    value: string;
  }>();
  if (selectedCategory?.id) {
    filteredEvents = filteredEvents.filter(item => {
      if (selectedCategory.id === CategoryEnum.ACTIVE) {
        return moment().isBefore(moment(item.evnhEndDate));
      }
      if (selectedCategory.id === CategoryEnum.PAST) {
        return moment().isAfter(moment(item.evnhEndDate));
      }
      return Number(item.evnhType) === Number(selectedCategory.id);
    });
    filteredData = filteredData.filter(item =>
      filteredEvents.find(s => s.id === item.links.mregEventId),
    );
  }

  const fetchList = () => {
    setIsLoading(true);
    httpRequest
      .get('member_resource/transaction')
      .then(res => {
        console.info('res getEvents', JSON.stringify(res.data));
        if (res.data) {
          setData(res.data);
        }
        EventService.getEvents()
          .then(ress => {
            if (ress.data) {
              setEvent(ress.data);
            }
          })
          .catch(err => {
            Toast.show({
              title: 'Failed to get events',
              description: getErrorMessage(err),
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch(err => {
        Toast.show({
          title: 'Failed to get events',
          description: getErrorMessage(err),
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchList();
  }, []);

  const _renderItem = ({item}: {item: Datum}) => {
    const event = data?.linked.mregEventId.find(
      ({id}) => id.toString() === item.links.mregEventId.toString(),
    );

    const transaction = data?.linked.mregTrnsId.find(
      ({id}) => id.toString() === item.links.mregTrnsId.toString(),
    );

    if (!event || !transaction) {
      return null;
    }
    const cleanStartDate = event.evnhStartDate.split(' ')[0];
    const cleanEndDate = event.evnhEndDate.split(' ')[0];

    const cleanTransactionExpTime = transaction.trnsExpiredTime;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MyEventsDetail', {
            transactionId: item.mregOrderId,
            eventId: event.evnhId,
            regStatus: item.mregStatus,
          })
        }>
        <MyEventCard
          title={event.evnhName}
          date={
            moment(cleanStartDate).format(
              cleanStartDate.split('-')[2] === cleanEndDate.split('-')[2] &&
                cleanStartDate !== cleanEndDate
                ? 'MMM D'
                : 'MMM D YYYY',
            ) +
            (cleanStartDate !== cleanEndDate
              ? ' - ' + moment(cleanEndDate).format('MMM D YYYY')
              : '')
          }
          paid={!!transaction.trnsConfirmTime}
          transactionExpirationTime={cleanTransactionExpTime}
          isAvailable={false}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Section title="Our Events" _title={{py: 2, px: 4}}>
      <CategoryButton
        categories={[{id: null, value: 'All'}, ...Object.values(EVENT_TYPES)]}
        selected={selectedCategory?.id || null}
        style={{px: 4}}
        onSelect={cat => setSelectedCategory(cat)}
      />

      <FlatList
        refreshing={isLoading}
        data={filteredData}
        renderItem={_renderItem}
        keyExtractor={item => item.id.toString()}
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
