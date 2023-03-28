import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {t} from 'i18next';
import {Text, Toast} from 'native-base';
import React, {useState} from 'react';
import Button from '../../../components/buttons/Button';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {
  GetEventResponse,
  PaymentsEntity,
  TransactionStatus,
} from '../../../types/event.type';

type Props = {
  transactionId: string;
  status?: TransactionStatus;
  payment: PaymentsEntity;
  isPaymentGenerated: boolean;
  isBallot: boolean;
  eventDetail?: GetEventResponse;
  evpaEvncId: string;
  isRegisteredEvent: boolean;
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
      if (
        props.isPaymentGenerated
        // detailTransaction?.linked?.trihTrnsId?.length !== 0 &&
        // detailTransaction?.linked?.trihTrnsId?.find(
        //   (item: any) => item.trihIsCurrent === 1,
        // )?.trihPaymentType === payment?.evptMsptName
      ) {
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

  const handleButtonRegisterAgain = () => {
    setIsLoading(true);
    if (
      props.eventDetail &&
      (props.eventDetail?.categories || []).find(
        cat => cat.evncId === props.evpaEvncId,
      )
    ) {
      navigation.navigate('EventRegister', {
        event: props.eventDetail,
        selectedCategoryId: props.evpaEvncId || '',
      });
    } else {
      Toast.show({
        title: t('error.cannotRegisterEvent'),
        description: t('error.categoryPricingNotFound'),
      });
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
              {`Pay Now via ${props.payment?.evptLabel}`}
            </Text>
          </Button>
        )}
        <Button
          onPress={handleButtonChoosePaymentMethod}
          isLoading={isLoading}
          style={{marginTop: 12, marginHorizontal: 22}}>
          <Text
            fontWeight={500}
            color="white"
            fontSize={14}
            textAlign={'center'}>
            Choose Payment Method
          </Text>
        </Button>
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
