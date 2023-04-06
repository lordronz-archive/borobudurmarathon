import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {t} from 'i18next';
import {Text, Toast} from 'native-base';
import React, {useState} from 'react';
import Button from '../../../components/buttons/Button';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {TouchableOpacity} from 'react-native';
import {
  GetEventResponse,
  PaymentsEntity,
  TransactionStatus,
} from '../../../types/event.type';
import {EventService} from '../../../api/event.service';
import {handleErrorMessage} from '../../../helpers/apiErrors';

type Props = {
  transactionId: string;
  eventId?: number;
  status?: TransactionStatus;
  payment: PaymentsEntity;
  isPaymentGenerated: boolean;
  isBallot: boolean;
  evpaEvncId: string;
  onChoosePaymentMethod: () => void;
  onPayNow: () => void;
  onAfterButtonFinished: () => void;
};

export default function ButtonBasedOnStatus(props: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonPayNow = () => {
    setIsLoading(true);

    if (props.status === 'Waiting Payment') {
      if (props.isPaymentGenerated) {
        navigation.navigate('Payment', {
          transactionId: props.transactionId,
        });
      } else {
        props.onPayNow();
      }
    }
    // setpayment(undefined);
    props.onAfterButtonFinished();
    setIsLoading(false);
  };

  const handleButtonChoosePaymentMethod = () => {
    props.onChoosePaymentMethod();
  };

  const handleButtonRegisterAgain = async () => {
    setIsLoading(true);

    if (!props.eventId) {
      Toast.show({
        title: t('error.cannotRegisterEvent'),
        description: 'Event ID not found',
      });
      return;
    }

    try {
      const resEvent = await EventService.getEvent(props.eventId);
      console.info('res get detail event', JSON.stringify(resEvent));
      navigation.navigate('EventRegister', {
        event: resEvent,
        selectedCategoryId: props.evpaEvncId || '',
      });

      if (
        props.eventId &&
        resEvent &&
        (resEvent?.categories || []).find(
          cat => cat.evncId === props.evpaEvncId,
        )
      ) {
        //
      } else {
        Toast.show({
          title: t('error.cannotRegisterEvent'),
          description: t('error.categoryPricingNotFound'),
        });
      }

      setIsLoading(false);
    } catch (err) {
      console.info('err get event detail', JSON.stringify(err));
      handleErrorMessage(err, t('error.failedToGetEvent'), {
        // onAnyError: () => {
        //   navigation.goBack();
        // },
      });
      setIsLoading(false);
    }

    props.onAfterButtonFinished();
    setIsLoading(false);
  };

  if (props.status === 'Waiting Payment') {
    return (
      <>
        {props.payment && (
          <Button
            onPress={handleButtonPayNow}
            isLoading={isLoading}
            style={{marginTop: 12, marginHorizontal: 22}}>
            <Text
              fontWeight={500}
              color="white"
              fontSize={14}
              textAlign={'center'}>
              {`${t('payment.payNowVia')} ${props.payment?.evptLabel}`}
            </Text>
          </Button>
        )}

        {props.payment ? (
          <TouchableOpacity
            onPress={handleButtonChoosePaymentMethod}
            disabled={isLoading}
            style={{marginTop: 12, marginHorizontal: 22}}>
            <Text
              fontWeight={500}
              color="primary.900"
              fontSize={14}
              textAlign={'center'}>
              {t('payment.changePaymentMethod')}
            </Text>
          </TouchableOpacity>
        ) : (
          <Button
            onPress={handleButtonChoosePaymentMethod}
            isLoading={isLoading}
            style={{marginTop: 12, marginHorizontal: 22}}>
            <Text
              fontWeight={500}
              color="white"
              fontSize={14}
              textAlign={'center'}>
              {t('payment.choosePaymentMethod')}
            </Text>
          </Button>
        )}
      </>
    );
  } else if (props.status === 'Payment Expired' && !props.isBallot) {
    // register again
    return (
      <Button
        onPress={handleButtonRegisterAgain}
        isLoading={isLoading}
        style={{marginTop: 12, marginHorizontal: 22}}>
        <Text fontWeight={500} color="white" fontSize={14} textAlign={'center'}>
          {t('event.registerEventAgain')}
        </Text>
      </Button>
    );
  }
  return <></>;
}
