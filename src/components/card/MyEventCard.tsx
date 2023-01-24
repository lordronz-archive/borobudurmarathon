import moment from 'moment';
import {HStack, VStack, Text, Box, Stack, Badge, Alert} from 'native-base';
import React from 'react';
import IconRun from '../../assets/icons/IconRun';
import IconTag from '../../assets/icons/IconTag';
import MButton from '../buttons/Button';

type MyCardEventProps = {
  title: string;
  paid: boolean;
  date: string;
  transactionExpirationTime?: string;
  isAvailable?: boolean;
};

enum PAYMENT_STATUS {
  REGISTERED,
  WAITING_PAYMENT,
  PAID,
  UNQUALIFIED,
  PAYMENT_EXPIRED,
}

export default function MyCardEvent({
  title,
  date,
  paid,
  transactionExpirationTime,
}: MyCardEventProps) {
  const status = paid
    ? PAYMENT_STATUS.PAID
    : moment().isBefore(moment(transactionExpirationTime))
    ? PAYMENT_STATUS.WAITING_PAYMENT
    : PAYMENT_STATUS.PAYMENT_EXPIRED;

  return (
    <Box alignItems="flex-start" my={3} width="100%">
      <HStack flex={1}>
        <Stack pl={3} flexGrow={1} space="2">
          <HStack flex="1" justifyContent={'space-between'} space="1">
            <Text
              flex={'1'}
              fontSize="md"
              mt="0"
              fontWeight="600"
              fontFamily="Poppins-Medium"
              flexWrap={'wrap'}>
              {title}
            </Text>
            {status === PAYMENT_STATUS.PAID ? (
              <Badge
                backgroundColor="#DFF4E0"
                px="3"
                py="0.5"
                borderRadius="4"
                alignSelf="flex-start"
                _text={{
                  color: '#26A62C',
                  fontWeight: 'bold',
                  fontSize: 'xs',
                }}>
                Paid
              </Badge>
            ) : status === PAYMENT_STATUS.PAYMENT_EXPIRED ? (
              <Badge
                backgroundColor="#FDEBEB"
                px="3"
                py="0.5"
                borderRadius="4"
                alignSelf="flex-start"
                _text={{
                  color: '#FE4545',
                  fontWeight: 'bold',
                  fontSize: 'xs',
                }}>
                Payment Expired
              </Badge>
            ) : status === PAYMENT_STATUS.WAITING_PAYMENT ? (
              <Badge
                backgroundColor="#FFF8E4"
                px="3"
                py="0.5"
                borderRadius="4"
                alignSelf="flex-start"
                _text={{
                  color: '#A4660A',
                  fontWeight: 'bold',
                  fontSize: 'xs',
                }}>
                Waiting Payment
              </Badge>
            ) : null}
          </HStack>
          <HStack flex="1" justifyContent={'space-between'}>
            <HStack space={1} alignItems="center">
              <IconRun />
              <Text fontSize="xs" color="coolGray.500">
                {date}
              </Text>
            </HStack>
            <HStack space={2} alignItems="center">
              <IconTag />
              <Text fontSize="xs" color="coolGray.500">
                Elite Runner 42 Km
              </Text>
            </HStack>
          </HStack>
          {status === PAYMENT_STATUS.WAITING_PAYMENT && (
            <HStack space="2">
              <Alert
                status="warning"
                bgColor={'#FFF8E4'}
                borderRadius={8}
                flexGrow={1}>
                <VStack space={2} flexShrink={1} w="100%">
                  <HStack
                    flexShrink={1}
                    space={2}
                    justifyContent="space-between">
                    <HStack space={2} flexShrink={1} alignItems="center">
                      <Alert.Icon mt="1" />
                      <Text fontSize={12} color="coolGray.800">
                        Pay before{' '}
                        {moment(transactionExpirationTime).format(
                          'DD MMM YYYY, HH:MM',
                        )}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Alert>
              <MButton variant="outline" _text={{fontSize: 12}}>
                Pay Now
              </MButton>
            </HStack>
          )}
        </Stack>
      </HStack>
    </Box>
  );
}
