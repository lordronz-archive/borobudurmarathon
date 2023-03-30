import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {t} from 'i18next';
import moment from 'moment';
import {Center, Divider, FlatList, Spinner} from 'native-base';
import React, {ComponentType, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {EventService} from '../../../api/event.service';
import CategoryButton from '../../../components/buttons/CategoryButton';
import MyEventCard from '../../../components/card/MyEventCard';
import EmptyMessage from '../../../components/EmptyMessage';
import Section from '../../../components/section/Section';
import {handleErrorMessage} from '../../../helpers/apiErrors';
import {getTransactionStatus} from '../../../helpers/transaction';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {Datum} from '../../../types/event.type';
import {GetTransactionsResponse} from '../../../types/transactions.type';

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
  const [resTransactions, setResTransactions] =
    useState<GetTransactionsResponse>();
  let filteredData = [...(resTransactions?.data || [])];
  const [selectedCategory, setSelectedCategory] = useState<{
    id: CategoryEnum | null;
    value: string;
  }>();

  const fetchList = () => {
    setIsLoading(true);
    EventService.getTransaction()
      .then(res => {
        console.info('res transaction', JSON.stringify(res.data));
        if (res.data) {
          setResTransactions(res.data);
        }
      })
      .catch(err => {
        handleErrorMessage(err, t('error.failedToGetEvents'), {
          ignore404: true,
          on409: () => {
            navigation.navigate('Logout');
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchList();
  }, [IsFocused]);

  const _renderItem = ({item}: {item: Datum}) => {
    const event = resTransactions?.linked.mregEventId.find(
      ({id}) => id.toString() === item.links.mregEventId.toString(),
    );

    const transaction = resTransactions?.linked.mregTrnsId.find(
      ({id}) => id.toString() === item.links.mregTrnsId.toString(),
    );

    const category = resTransactions?.linked.mregEvncId.find(
      ({id}) => id.toString() === item.links.mregEvncId.toString(),
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
          })
        }>
        <MyEventCard
          regId={transaction.trnsRefId}
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
          status={getTransactionStatus({
            isBallot: event.evnhBallot === 1,
            regStatus: transaction.trnsStatus,
            trnsConfirmed: transaction?.trnsConfirmed,
            trnsExpiredTime: transaction?.trnsExpiredTime,
          })}
          category={category?.evncName || ''}
          transactionExpirationTime={cleanTransactionExpTime}
          isAvailable={false}
          onPayNowClick={() =>
            navigation.navigate('MyEventsDetail', {
              transactionId: item.mregOrderId,
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
