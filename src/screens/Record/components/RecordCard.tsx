import React from 'react';
import {
  Flex,
  VStack,
  Text,
  HStack,
  AddIcon,
  AspectRatio,
  Pressable,
  Image,
} from 'native-base';
import {Heading} from '../../../components/text/Heading';

type RecordCardProps = {
  time: string;
  distanceInKm: string | number;
  averagePacePerKm: string;
};

export default function RecordCard({
  time,
  distanceInKm,
  averagePacePerKm,
}: RecordCardProps) {
  return (
    <Flex
      direction="column"
      justify="space-evenly"
      alignItems={'flex-start'}
      p="3"
      backgroundColor={'white'}
      borderColor="#E8ECF3"
      borderWidth={1}
      borderRadius={8}
      shadow="1">
      <Heading fontSize={16} fontWeight={600}>
        Elite Runner 42 Km Borobudur Marathon 2022
      </Heading>
      <Flex
        direction="row"
        py="2"
        borderTopWidth={1}
        borderColor={'#E8ECF3'}
        borderBottomWidth={1}
        flex="1"
        w="100%">
        <VStack alignItems="flex-start" flex="1">
          <HStack>
            <Text py="2" color={'#768499'} fontSize={12}>
              Time
            </Text>
          </HStack>
          <Text py="1" fontWeight={500} fontSize={18} color="#EB1C23">
            {time}
          </Text>
        </VStack>
        <VStack alignItems="flex-start" flex="1">
          <HStack>
            <Text py="2" color={'#768499'} fontSize={12}>
              Distance
            </Text>
          </HStack>
          <Text py="1" fontWeight={500} fontSize={18}>
            {distanceInKm}{' '}
            <Text fontWeight={600} color={'#768499'} fontSize={12}>
              km
            </Text>
          </Text>
        </VStack>
        <VStack alignItems="flex-start" flex="1">
          <HStack>
            <Text py="2" color={'#768499'} fontSize={12}>
              Avg. Pace
            </Text>
          </HStack>
          <Text py="1" fontWeight={500} fontSize={18}>
            {averagePacePerKm}
            <Text fontWeight={600} color={'#768499'} fontSize={12}>
              /km
            </Text>
          </Text>
        </VStack>
      </Flex>
      <VStack>
        <Text py="2" color={'#768499'} fontSize={12}>
          My Galleries
        </Text>
        <HStack w="100%" space="10px" overflow="hidden">
          <AspectRatio
            w="30%"
            ratio={1 / 1}
            backgroundColor="#F4F6F9"
            borderRadius={8}>
            <Pressable onPress={() => console.info('PRESSED')}>
              <VStack
                flex="1"
                justifyContent="center"
                alignItems="center"
                w="100%"
                h="100%">
                <AddIcon />
                <Text
                  color="#768499"
                  textAlign={'center'}
                  fontWeight="500"
                  fontSize="10px">
                  Add Photo
                </Text>
              </VStack>
            </Pressable>
          </AspectRatio>
          <AspectRatio
            w="30%"
            ratio={1 / 1}
            backgroundColor="#F4F6F9"
            borderRadius={8}>
            <Pressable onPress={() => console.info('PRESSED')}>
              <Image
                source={require('../../../assets/images/NoImage.png')}
                w="100%"
                h="100%"
                borderRadius={8}
                alt="title"
              />
            </Pressable>
          </AspectRatio>
          <AspectRatio
            w="30%"
            ratio={1 / 1}
            backgroundColor="#F4F6F9"
            borderRadius={8}>
            <Pressable onPress={() => console.info('PRESSED')}>
              <Image
                source={require('../../../assets/images/NoImage.png')}
                w="100%"
                h="100%"
                borderRadius={8}
                alt="title"
              />
            </Pressable>
          </AspectRatio>
          <AspectRatio
            w="30%"
            ratio={1 / 1}
            backgroundColor="#F4F6F9"
            borderRadius={8}>
            <Pressable onPress={() => console.info('PRESSED')}>
              <Image
                source={require('../../../assets/images/NoImage.png')}
                w="100%"
                h="100%"
                borderRadius={8}
                alt="title"
              />
            </Pressable>
          </AspectRatio>
        </HStack>
      </VStack>
    </Flex>
  );
}
