import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {t} from 'i18next';
import {
  Actionsheet,
  AlertDialog,
  Text,
  Toast,
  ScrollView,
  Button as NBButton,
} from 'native-base';
import React, {useState} from 'react';
import Button from '../../../components/buttons/Button';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {Dimensions, TouchableOpacity} from 'react-native';
import {
  PaymentsEntity,
  PAYMENT_METHODS,
  TransactionStatus,
  PaymentsSpecial,
} from '../../../types/event.type';
import {EventService} from '../../../api/event.service';
import {handleErrorMessage} from '../../../helpers/apiErrors';
import {TrihTrnsIdEntity} from '../../../types/transaction.type';
const screenWidth = Dimensions.get('window').width;

type Props = {
  transactionId: string;
  eventId?: number;
  status?: TransactionStatus;
  activePayment?: TrihTrnsIdEntity;
  // isPaymentGenerated: boolean;
  isBallot: boolean;
  evpaEvncId: string;
  // onChoosePaymentMethod: () => void;
  onPayNow: (paymentType: string) => void;
  onAfterButtonFinished?: () => void;
};

export default function ButtonBasedOnStatus(props: Props) {
  const confirmRef = React.useRef(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [isLoading, setIsLoading] = useState(false);
  const [isShowModalChoosePaymentMethod, setIsShowModalChoosePaymentMethod] =
    useState(false);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [tmpPayment, setTmpPayment] = useState<
    PaymentsEntity | PaymentsSpecial
  >();
  const [paymentMethods, setPaymentMethods] = useState<
    (PaymentsSpecial | PaymentsEntity)[]
  >([]);

  const handleButtonPayNow = () => {
    setIsLoading(true);

    if (props.status === 'Waiting Payment') {
      navigation.navigate('Payment', {
        transactionId: props.transactionId,
      });
    }
    // setpayment(undefined);
    if (props.onAfterButtonFinished) {
      props.onAfterButtonFinished();
    }
    setIsLoading(false);
  };

  const handleButtonChoosePaymentMethod = async () => {
    if (!props.eventId) {
      return;
    }
    setIsLoading(true);

    try {
      const resEvent = await EventService.getEvent(props.eventId);
      console.info('res get detail event', JSON.stringify(resEvent));

      let list = [
        ...(props.status === 'Waiting Payment'
          ? resEvent?.payments || []
          : []
        ).filter(item => item.evptIsPublic === '1'),
        ...(props.status === 'Registered' && props.isBallot
          ? resEvent.payments_special || []
          : []
        ).filter(item => item.evptIsPublic.toString() === '1'),
      ];

      list = list.filter(
        item => item.evptMsptName !== props.activePayment?.trihPaymentType,
      );
      list.sort((a, b) =>
        a.evptLabel < b.evptLabel ? -1 : a.evptLabel > b.evptLabel ? 1 : 0,
      );
      setPaymentMethods([...list]);
      setIsShowModalChoosePaymentMethod(true);

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

      if (resEvent && !resEvent.access) {
        Toast.show({
          description: resEvent.notif,
        });
        return;
      }

      if (
        props.eventId &&
        resEvent &&
        (resEvent?.categories || []).find(
          cat => cat.evncId === props.evpaEvncId,
        )
      ) {
        navigation.navigate('EventRegister', {
          event: resEvent,
          selectedCategoryId: props.evpaEvncId || '',
        });
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

    if (props.onAfterButtonFinished) {
      props.onAfterButtonFinished();
    }
    setIsLoading(false);
  };

  if (
    props.status === 'Waiting Payment' ||
    (props.status === 'Registered' && props.isBallot)
  ) {
    return (
      <>
        {props.activePayment && (
          <Button
            onPress={handleButtonPayNow}
            isLoading={isLoading}
            style={{marginTop: 12, marginHorizontal: 22}}>
            <Text
              fontWeight={500}
              color="white"
              fontSize={14}
              textAlign={'center'}>
              {`${t('payment.payNowVia')} ${
                (PAYMENT_METHODS as any)[props.activePayment?.trihPaymentType]
                  ? (PAYMENT_METHODS as any)[
                      props.activePayment?.trihPaymentType
                    ].name
                  : props.activePayment?.trihPaymentTypeName
              }`}
            </Text>
          </Button>
        )}

        {props.activePayment ? (
          <TouchableOpacity
            onPress={handleButtonChoosePaymentMethod}
            disabled={isLoading}
            style={{marginTop: 12, marginHorizontal: 22}}>
            <Text
              fontWeight={500}
              color={isLoading ? 'gray.600' : 'primary.900'}
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

        <Actionsheet
          isOpen={isShowModalChoosePaymentMethod}
          onClose={() => setIsShowModalChoosePaymentMethod(false)}
          size={'full'}>
          <Actionsheet.Content maxWidth={'100%'}>
            <Text color={'#1E1E1E'} fontSize={'20px'} fontWeight={600}>
              {props.activePayment
                ? t('payment.changePaymentMethod')
                : t('payment.choosePaymentMethod')}
            </Text>
            <Text color={'#768499'} fontSize={'12px'} fontWeight={400}>
              {t('payment.choosePaymentMethodDescription')}
            </Text>

            <ScrollView
              flexGrow={1}
              width={'full'}
              height={screenWidth / 1.4}
              showsVerticalScrollIndicator={false}
              mt="3">
              {(paymentMethods || []).map(item => (
                <Actionsheet.Item
                  key={item.evptMsptId}
                  onPress={() => {
                    setTmpPayment(item);
                    setIsShowModalChoosePaymentMethod(false);
                    setIsShowModalConfirm(true);
                  }}
                  color={'#1E1E1E'}
                  fontSize={'14px'}
                  fontWeight={400}>
                  {item.evptLabel}
                </Actionsheet.Item>
              ))}
            </ScrollView>
          </Actionsheet.Content>
        </Actionsheet>

        <AlertDialog
          leastDestructiveRef={confirmRef}
          isOpen={isShowModalConfirm}>
          <AlertDialog.Content>
            <AlertDialog.Header>
              {t('payment.confirmPayment')}
            </AlertDialog.Header>
            <AlertDialog.Body marginY={'20px'}>
              <Text
                textAlign={'center'}
                fontSize={'16px'}
                fontWeight={600}
                marginBottom={'12px'}>
                {`${t('payment.areYouSureWantToUse')} "${
                  tmpPayment?.evptLabel
                }" ${t('payment.asYourPaymentMethod')}?`}
              </Text>
              {/* <Text
              textAlign={'center'}
              color={'#768499'}
              fontSize={'11px'}
              fontWeight={400}>
              You can't change payment method after confirming your choice.
            </Text> */}
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <NBButton.Group width={'full'}>
                <NBButton
                  flex={1}
                  backgroundColor={'#fff'}
                  borderColor={'#C5CDDB'}
                  borderStyle={'solid'}
                  borderWidth={1}
                  borderRadius={'8px'}
                  onPress={() => {
                    setIsShowModalConfirm(false);
                    setTmpPayment(undefined);
                    setIsShowModalChoosePaymentMethod(true);
                  }}
                  ref={confirmRef}>
                  <Text fontSize={'14px'} fontWeight={400}>
                    {t('cancel')}
                  </Text>
                </NBButton>
                <NBButton
                  flex={1}
                  borderRadius={'8px'}
                  onPress={() => {
                    // setConfirmPayment(tmpPayment);
                    if (tmpPayment?.evptMsptId) {
                      props.onPayNow(tmpPayment?.evptMsptId);
                      setTmpPayment(undefined);
                      setIsShowModalConfirm(false);
                    }
                  }}>
                  {t('sure')}
                </NBButton>
              </NBButton.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
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
