import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import {Divider, FlatList, Toast} from 'native-base';
import React, {ComponentType, useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import CategoryButton from '../../../components/buttons/CategoryButton';
import MyEventCard from '../../../components/card/MyEventCard';
import Section from '../../../components/section/Section';
import {getErrorMessage} from '../../../helpers/errorHandler';
import httpRequest from '../../../helpers/httpRequest';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {Datum, EVENT_TYPES, Transaction} from '../../../types/event.type';
import {EventService} from '../../../api/event.service';

export default function SectionListMyEvent() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Transaction>();
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number | null;
    value: string;
  }>();

  const fetchList = () => {
    setIsLoading(true);
    httpRequest
      .get('member_resource/transaction')
      .then(res => {
        console.info('res transaction', JSON.stringify(res.data));
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

    const handlePayNow = async () => {
      setIsLoading(true);

      try {
        const resPayNow = await EventService.checkoutTransaction({
          transactionId: item.links.mregTrnsId,
          paymentType: '10',
        });
        console.info('res pay now', JSON.stringify(resPayNow));

        if (resPayNow && resPayNow.data) {
          navigation.navigate('Payment', {
            transactionId: item.mregOrderId,
          });
        }
      } catch (err) {
        Toast.show({
          title: 'Failed to pay now',
          description: getErrorMessage(err),
        });
      } finally {
        setIsLoading(false);
      }
    };

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
          category={category?.evncName}
          transactionExpirationTime={cleanTransactionExpTime}
          isAvailable={false}
          onPayNowClick={() => handlePayNow()}
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
        data={data?.data}
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
