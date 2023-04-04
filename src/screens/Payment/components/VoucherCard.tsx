import {t} from 'i18next';
import {Box, HStack, VStack, Text, Image, ShareIcon} from 'native-base';
import React from 'react';
import IconInfo from '../../../assets/icons/IconInfo';
import {TransactionStatus} from '../../../types/event.type';
import Button from '../../../components/buttons/Button';
import IconQr from '../../../assets/icons/IconQr';

type Props = {
  status?: TransactionStatus;
  isBallot?: boolean;
};
export default function VoucherCard(props: Props) {
  return (
    <HStack
      alignContent={'center'}
      justifyContent={'center'}
      alignItems={'center'}>
      <Box h="full" bg="amber.100" alignItems={'center'}>
        <Image
          source={require('../../../assets/images/voucher_image.png')}
          alignSelf={'center'}
          mb={1}
          alt="Coming soon"
        />
      </Box>
      <Box bg={'#FFF8E4'} h="full">
        <VStack space="3.5">
          <HStack space="5">
            <VStack space="2.5">
              <Text fontWeight={600} fontSize="16px">
                Buy 2 Get 1 Free Aqua 150ml
              </Text>
              <Text>Nov 28 - Dec 07 2023</Text>
            </VStack>
            <VStack>
              <ShareIcon size="10" />
            </VStack>
          </HStack>
          <HStack alignItems={'center'} space={'2'}>
            <HStack>
              <Text fontWeight={600} fontSize="18px">
                BORMAR2022
              </Text>
            </HStack>
            <Button variant="outline" style={{maxWidth: 70}}>
              Copy
            </Button>
            <Button style={{maxWidth: 50, maxHeight: 50}}>
              <IconQr stroke="white" />
            </Button>
          </HStack>
        </VStack>
      </Box>
    </HStack>
  );
}
