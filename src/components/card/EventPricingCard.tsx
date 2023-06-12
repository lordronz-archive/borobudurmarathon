import {t} from 'i18next';
import {
  Box,
  HStack,
  Stack,
  Text,
  Flex,
  VStack,
  CheckIcon,
  FlatList,
  CheckCircleIcon,
  View,
} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';

type EventPricingCardProps = {
  title: string;
  subtitle?: string;
  originalPrice: number;
  finalPrice: number;
  benefits: string[];
  selected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  status?: 'SOLDOUT' | 'OPEN';
  hasActiveInvitation?: boolean;
};

export default function EventPricingCard({
  title,
  subtitle = '',
  originalPrice,
  finalPrice,
  benefits,
  selected,
  onSelect,
  disabled,
  status,
  ...props
}: EventPricingCardProps) {
  let textOriginalPrice;
  let textFinalPrice;
  let textDiscountPercentage;

  if (originalPrice === finalPrice) {
    textOriginalPrice;
  } else if (finalPrice < originalPrice) {
    // discount
    textOriginalPrice = originalPrice.toLocaleString('id-ID');
    textDiscountPercentage = (
      ((originalPrice - finalPrice) / originalPrice) *
      100
    ).toFixed(2);
  }
  textFinalPrice = finalPrice.toLocaleString('id-ID');

  const _renderBenefitsItem = (item: string, index: number) => {
    return (
      <HStack
        space={2}
        // style={[
        //   index % 2 === 0
        //     ? {backgroundColor: 'red'}
        //     : {backgroundColor: 'yellow'},
        // ]}
      >
        <CheckIcon size="5" mt="0.5" color="#EB1C23" />
        <Text color="#1E1E1E;" fontSize="sm" fontWeight={500}>
          {item}
        </Text>
      </HStack>
    );
  };

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={{width: '100%'}}
      disabled={disabled}>
      <Box alignItems="center" w={'100%'} my={3}>
        <Box
          rounded="lg"
          overflow="hidden"
          w="100%"
          borderColor="coolGray.200"
          borderWidth="1"
          p={4}>
          <HStack
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Text color={'#EB1C23'} fontWeight={800} fontSize="lg" width="70%">
              {title}
            </Text>

            {props.hasActiveInvitation && status === 'SOLDOUT' ? (
              <HStack>
                <Box bgColor={'#FFE1E2'} px={2} py={1} borderRadius={10}>
                  <Text color={'#EB1C23'} fontSize="xs" fontWeight={600}>
                    {t('event.soldout')}
                  </Text>
                </Box>
                <Box bgColor={'#FFE1E2'} px={2} py={1} borderRadius={10}>
                  <Text color={'#EB1C23'} fontSize="xs" fontWeight={600}>
                    {t('invitation.invited')}
                  </Text>
                </Box>
              </HStack>
            ) : props.hasActiveInvitation ? (
              <Box bgColor={'#FFF8E4'} px={2} py={1} borderRadius={10}>
                <Text color={'#A4660A'} fontSize="xs" fontWeight={600}>
                  {t('invitation.invited')}
                </Text>
              </Box>
            ) : status === 'SOLDOUT' ? (
              <Box bgColor={'#FFE1E2'} px={2} py={1} borderRadius={10}>
                <Text color={'#EB1C23'} fontSize="xs" fontWeight={600}>
                  {t('event.soldout')}
                </Text>
              </Box>
            ) : (
              false
            )}

            {selected ? (
              <CheckCircleIcon size={30} color="primary.900" />
            ) : !disabled ? (
              <TouchableOpacity onPress={onSelect}>
                {/* <CircleIcon size="xl" color="gray.300" /> */}
                <View
                  borderRadius="full"
                  borderColor="gray.400"
                  borderWidth="4"
                  width={30}
                  height={30}
                />
              </TouchableOpacity>
            ) : (
              false
            )}
          </HStack>
          <Text color={'#768499'} fontSize="sm" fontWeight={400}>
            {subtitle}
          </Text>
          <Box mx={-4} mt={4} p={4} bgColor={'#E8ECF3'}>
            <Flex direction="row" justify="space-between">
              <VStack alignItems="flex-start">
                {!!textOriginalPrice && (
                  <Text
                    color={'#768499'}
                    fontSize="sm"
                    fontWeight={400}
                    strikeThrough>
                    IDR {textOriginalPrice}
                  </Text>
                )}
                <Text color={'black'} fontSize="lg" fontWeight={700}>
                  IDR {textFinalPrice}
                </Text>
              </VStack>
              {!!textDiscountPercentage && (
                <Box bgColor={'#FFE1E2'} px={2} pt={2} borderRadius={10}>
                  <Text color={'#EB1C23'} fontSize="lg" fontWeight={600}>
                    {textDiscountPercentage}% off
                  </Text>
                </Box>
              )}
            </Flex>
          </Box>
          {benefits.length > 0 && (
            <Stack my={4}>
              <Text color={'#768499'}>Benefit :</Text>
              <FlatList
                data={benefits}
                renderItem={({item, index}) => _renderBenefitsItem(item, index)}
              />
            </Stack>
          )}
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
