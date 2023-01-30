import moment from 'moment';
import {HStack, VStack, Text, Box, Stack, Badge, Alert} from 'native-base';
import React, {useMemo} from 'react';
import IconRun from '../../assets/icons/IconRun';
import IconTag from '../../assets/icons/IconTag';
import MButton from '../buttons/Button';
import {useNavigation} from '@react-navigation/native';

type MyCardEventProps = {
  title: string;
  status: string;
  date: string;
  transactionExpirationTime?: string;
  isAvailable?: boolean;
  category: string;
  onPayNowClick: () => void;
};

export default function MyCardEvent({
  title,
  date,
  status,
  transactionExpirationTime,
  category,
  onPayNowClick,
}: MyCardEventProps) {
  function statusColor(status: string) {
    switch (status) {
      case 'Registered':
        return {
          bgColor: '#E7F3FC',
          color: '#3D52E6',
        };
      case 'Unqualified':
      case 'Payment Expired':
        return {
          bgColor: '#FDEBEB',
          color: '#EB1C23',
        };
      case 'Waiting Payment':
        return {
          bgColor: '#FFF8E4',
          color: '#A4660A',
        };
      case 'Paid':
        return {
          bgColor: ' #DFF4E0',
          color: '#26A62C',
        };
      default:
        return {
          bgColor: ' #DFF4E0',
          color: '#26A62C',
        };
    }
  }

  const statusComp = useMemo(() => {
    const color = statusColor(status || '');

    return (
      <Text
        fontSize={12}
        fontWeight={600}
        paddingX={'10px'}
        height={'30px'}
        paddingY={'4px'}
        borderRadius={3}
        bg={color.bgColor}
        color={color.color}>
        {status}
      </Text>
    );
  }, [status]);

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
            {statusComp}
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
                {category}
              </Text>
            </HStack>
          </HStack>
          {status === 'Waiting Payment' && (
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
              <MButton
                variant="outline"
                _text={{fontSize: 12}}
                onPress={() => onPayNowClick()}>
                Pay Now
              </MButton>
            </HStack>
          )}
        </Stack>
      </HStack>
    </Box>
  );
}
