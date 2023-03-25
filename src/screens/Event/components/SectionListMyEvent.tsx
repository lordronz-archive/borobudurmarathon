import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import {Box, Center, Divider, FlatList, Spinner, Toast} from 'native-base';
import React, {ComponentType, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {EventService} from '../../../api/event.service';
import CategoryButton from '../../../components/buttons/CategoryButton';
import MyEventCard from '../../../components/card/MyEventCard';
import EmptyMessage from '../../../components/EmptyMessage';
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
  const IsFocused = useIsFocused();
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
        console.info('res transaction', JSON.stringify(res.data));
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
            if (getErrorMessage(err).includes('Not Found')) {
              //
            } else {
              Toast.show({
                title: 'Failed to get events',
                description: getErrorMessage(err),
              });
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch(err => {
        if (getErrorMessage(err).includes('Not Found')) {
          //
        } else {
          Toast.show({
            title: 'Failed to get events',
            description: getErrorMessage(err),
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchList();
  }, [IsFocused]);

  const _renderItem = ({item}: {item: Datum}) => {
    const event = data?.linked.mregEventId.find(
      ({id}) => id.toString() === item.links.mregEventId.toString(),
    );

    const transaction = data?.linked.mregTrnsId.find(
      ({id}) => id.toString() === item.links.mregTrnsId.toString(),
    );

    const category = data?.linked.mregEvncId.find(
      ({id}) => id.toString() === item.links.mregEvncId.toString(),
    );

    if (!event || !transaction) {
      return null;
    }
    const cleanStartDate = event.evnhStartDate.split(' ')[0];
    const cleanEndDate = event.evnhEndDate.split(' ')[0];

    const cleanTransactionExpTime = transaction.trnsExpiredTime;

    const checkStatus = () => {
      let status;
      if (item.mregType === 'MB') {
        if (item.mregStatus === 0) {
          status = 'Registered';
        } else if (item.mregStatus === 99) {
          status = 'Unqualified';
        } else {
          if (transaction?.trnsConfirmed === 1) {
            status = 'Paid';
          } else if (moment(transaction?.trnsExpiredTime).isBefore(moment())) {
            status = 'Payment Expired';
          } else {
            status = 'Waiting Payment';
          }
        }
      } else {
        if (transaction?.trnsConfirmed === 1) {
          status = 'Paid';
        } else if (moment(transaction?.trnsExpiredTime).isBefore(moment())) {
          status = 'Payment Expired';
        } else {
          status = 'Waiting Payment';
        }
      }
      return status;
    };

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MyEventsDetail', {
            transactionId: item.mregOrderId,
            eventId: event.evnhId,
            isBallot: item.mregType === 'MB' ? true : false,
            regStatus: item.mregStatus,
          })
        }>
        <MyEventCard
          regId={transaction.trnsId}
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
          status={checkStatus()}
          category={category?.evncName || ''}
          transactionExpirationTime={cleanTransactionExpTime}
          isAvailable={false}
          onPayNowClick={() =>
            navigation.navigate('MyEventsDetail', {
              transactionId: item.mregOrderId,
              eventId: event.evnhId,
              isBallot: item.mregType === 'MB' ? true : false,
              regStatus: item.mregStatus,
            })
          }
        />
      </TouchableOpacity>
    );
  };

  const _renderEmpty = () => {
    return <EmptyMessage />;
  };

  if (isLoading) {
    return (
      <Center h="100%" w="100%">
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Section title="">
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
        ListEmptyComponent={_renderEmpty}
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
