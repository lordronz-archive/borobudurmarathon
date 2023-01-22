import {
  Box,
  HStack,
  Stack,
  Text,
  Flex,
  Radio,
  VStack,
  CheckIcon,
  FlatList,
} from 'native-base';
import React from 'react';

type EventPricingCardProps = {
  title: string;
  subtitle?: string;
  value: string;
};

export default function EventPricingCard({
  title,
  subtitle = '',
  value,
}: EventPricingCardProps) {
  const benefitsData = [
    'Medal*',
    'Jersey (Merchandise)',
    'Local UMKM Merchandise',
    'Free Ongkir',
  ];

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
        <Flex direction="row" justify="space-between">
          <Text color={'#EB1C23'} fontWeight={800} fontSize="lg">
            {title}
          </Text>
          <Radio value={value} />
        </Flex>
        <Text color={'#768499'} fontSize="sm" fontWeight={400}>
          {subtitle}
        </Text>
        <Box mx={-4} mt={4} p={4} bgColor={'#E8ECF3'}>
          <Flex direction="row" justify="space-between">
            <VStack alignItems="flex-start">
              <Text
                color={'#768499'}
                fontSize="sm"
                fontWeight={400}
                strikeThrough>
                IDR 200000
              </Text>
              <Text color={'black'} fontSize="lg" fontWeight={700}>
                IDR 170000
              </Text>
            </VStack>
            <Box bgColor={'#FFE1E2'} px={2} pt={2} borderRadius={10}>
              <Text color={'#EB1C23'} fontSize="lg" fontWeight={600}>
                15% off
              </Text>
            </Box>
          </Flex>
        </Box>
        <Stack my={4}>
          <Text color={'#768499'}>Benefit :</Text>
          <FlatList
            data={benefitsData}
            renderItem={({item}) => _renderBenefitsItem(item)}
          />
        </Stack>
      </Box>
    </Box>
  );
}
