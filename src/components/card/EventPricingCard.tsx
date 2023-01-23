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
import {numberWithCommas} from '../../helpers/currency';

type EventPricingCardProps = {
  title: string;
  subtitle?: string;
  originalPrice: number;
  finalPrice: number;
  benefits: string[];
  selected?: boolean;
  onSelect?: () => void;
};

export default function EventPricingCard({
  title,
  subtitle = '',
  originalPrice,
  finalPrice,
  benefits,
  selected,
  onSelect,
}: EventPricingCardProps) {
  let textOriginalPrice;
  let textFinalPrice;
  let textDiscountPercentage;

  if (originalPrice === finalPrice) {
    textOriginalPrice;
    textFinalPrice = finalPrice.toLocaleString('id-ID');
  } else if (finalPrice < originalPrice) {
    // discount
    textOriginalPrice = originalPrice.toLocaleString('id-ID');
    textFinalPrice = finalPrice.toLocaleString('id-ID');
    textDiscountPercentage = (
      ((originalPrice - finalPrice) / originalPrice) *
      100
    ).toFixed(2);
  }

  const _renderBenefitsItem = (item: string) => {
    return (
      <HStack space={2}>
        <CheckIcon size="5" mt="0.5" color="#EB1C23" />
        <Text color="#1E1E1E;" fontSize="sm" fontWeight={500}>
          {item}
        </Text>
      </HStack>
    );
  };

  return (
    <Box alignItems="center" w={'100%'} my={3}>
      <Box
        rounded="lg"
        overflow="hidden"
        w="100%"
        borderColor="coolGray.200"
        borderWidth="1"
        p={4}>
        <TouchableOpacity onPress={onSelect}>
          <Flex direction="row" justify="space-between">
            <Text color={'#EB1C23'} fontWeight={800} fontSize="lg">
              {title}
            </Text>

            {selected ? (
              <CheckCircleIcon size={30} color="primary.900" />
            ) : (
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
            )}
          </Flex>
          <Text color={'#768499'} fontSize="sm" fontWeight={400}>
            {subtitle}
          </Text>
        </TouchableOpacity>
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
        <Stack my={4}>
          <Text color={'#768499'}>Benefit :</Text>
          <FlatList
            data={benefits}
            renderItem={({item}) => _renderBenefitsItem(item)}
          />
        </Stack>
      </Box>
    </Box>
  );
}
