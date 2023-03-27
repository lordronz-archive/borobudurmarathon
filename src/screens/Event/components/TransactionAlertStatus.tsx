import {t} from 'i18next';
import {Box, HStack, VStack, Text} from 'native-base';
import React from 'react';
import IconInfo from '../../../assets/icons/IconInfo';
import {TransactionStatus} from '../../../types/event.type';

type Props = {
  status?: TransactionStatus;
  isBallot?: boolean;
};
export default function TransactionAlertStatus(props: Props) {
  if (props.status === 'Paid') {
    return <></>;
  } else {
    return (
      <Box mx="15" mt="15" mb="0" p={'10px'} borderRadius={5} bg={'#FFF8E4'}>
        <HStack>
          <IconInfo color="black" size={6} />
          <VStack flex={1} paddingLeft={'10px'}>
            <Text fontWeight={400} color="#201D1D" fontSize={12}>
              {props.status === 'Payment Expired'
                ? t('payment.paymentStatusExpired')
                : props.isBallot && props.status === 'Waiting Payment'
                ? t('payment.passBallotStage')
                : !props.isBallot && props.status === 'Waiting Payment'
                ? t('payment.pleaseCompletePayment')
                : t('payment.ballotAnnouncement')}
            </Text>
            {/* {(status === 'Registered' || status === 'Unqualified') && (
                    <Text
                      fontWeight={600}
                      color="#201D1D"
                      fontSize={12}
                      textDecorationLine={'underline'}>
                      Lihat detail info
                    </Text>
                  )} */}
          </VStack>
        </HStack>
      </Box>
    );
  }
}
