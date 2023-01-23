import {useNavigation, useRoute} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ShareIcon,
  Box,
  IconButton,
  Radio,
  ScrollView,
  Stack,
  Text,
  Image,
  Flex,
  HStack,
  Divider,
  Toast,
  View,
  VStack,
  Button,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {EventService} from '../../api/event.service';
import IconCalendar from '../../assets/icons/IconCalendar';
import IconRun from '../../assets/icons/IconRun';
import IconTag from '../../assets/icons/IconTag';
import EventPricingCard from '../../components/card/EventPricingCard';
import Header from '../../components/header/Header';
import Section from '../../components/section/Section';
import {getErrorMessage} from '../../helpers/errorHandler';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {GetEventResponse} from '../../types/event.type';

type Price = {
  id: string;
  name: string;
  originalPrice: number;
  finalPrice: number;
  benefits: string[];
};
export default function DetailEvent() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as RootStackParamList['EventDetail'];

  const [event, setEvent] = useState<GetEventResponse>();
  const [selected, setSelected] = useState<Price>();

  const informations: {icon: any; label: string; description: string}[] = [
    {
      icon: <IconTag size="5" mt="0.5" color="gray.500" />,
      label: 'Race Category',
      description: (event?.categories || [])
        .map(cat => cat.evncName)
        .join(', '),
    },
    {
      icon: <IconCalendar size="5" mt="0.5" color="gray.500" />,
      label: 'Registration Date',
      description:
        event?.data.evnhRegistrationStart +
        ' - ' +
        event?.data.evnhRegistrationEnd,
    },
    {
      icon: <IconRun size="5" mt="0.5" color="gray.500" />,
      label: 'Running Date',
      description: event?.data.evnhStartDate + ' - ' + event?.data.evnhEndDate,
    },
  ];

  const prices: Price[] = (event?.categories || []).map(cat => ({
    id: cat.evncId,
    name: cat.evncName,
    originalPrice: Number(cat.evncPrice),
    finalPrice: Number(cat.evncPrice),
    benefits: [
      'Medal',
      'Jersey (Merchandise)',
      'Local UMKM Merchandise',
      'Free Ongkir',
      'This is Dummy Data',
    ],
  }));
  // [
  //   {
  //     raceCategory: 'Race Category',
  //     raceDescription:
  //       'Young Talent 10 Km, Tilik Candi 21 Km, Elite Race 42 Km',
  //   },
  //   {
  //     raceCategory: 'Race Category',
  //     raceDescription:
  //       'Young Talent 10 Km, Tilik Candi 21 Km, Elite Race 42 Km',
  //   },
  //   {
  //     raceCategory: 'Race Category',
  //     raceDescription:
  //       'Young Talent 10 Km, Tilik Candi 21 Km, Elite Race 42 Km',
  //   },
  // ];

  useEffect(() => {
    EventService.getEvent(params.id)
      .then(res => {
        console.info('res getEvent', res);
        setEvent(res);
      })
      .catch(err => {
        Toast.show({
          title: 'Failed to get event',
          description: getErrorMessage(err),
        });
      });
  }, []);

  return (
    <VStack>
      <ScrollView backgroundColor={'#fff'}>
        <Header
          title=""
          left="back"
          right={
            <IconButton
              icon={<ShareIcon color="black" />}
              borderRadius="full"
            />
          }
        />
        <Stack mx={4}>
          <Text fontSize="sm" color={'#768499'} fontWeight={600} my={2}>
            {/* {event?.evnhType} */}
            OFFLINE
          </Text>
          <Text fontSize="xl" fontWeight={700} mb="2">
            {event?.data?.evnhName}
          </Text>
          <Text fontSize="sm" color={'#768499'} mb="2">
            Update at Sept 24, 2022
          </Text>
        </Stack>
        <Image
          w={'100%'}
          minH={250}
          alt="fallback text"
          source={
            event?.data.evnhThumbnail
              ? {uri: event?.data.evnhThumbnail}
              : require('../../assets/images/FeaturedEventImage.png')
          }
        />
        <Stack mx={4} mb={4}>
          <Text fontSize="sm" color={'#1E1E1E'} mt={3}>
            {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
          maximus pulvinar ligula vel interdum. Duis rutrum, lacus non
          consectetur porta, nulla neque tristique justo, vitae sodales mauris
          nisl et quam. Etiam vel feugiat libero. Cras hendrerit leo ac turpis
          sodales, suscipit dignissim leo ornare. */}
            {event?.data?.evnhDescription || 'No description'}
          </Text>
          <Text mt="2" fontSize={14} fontWeight="600" color="#1E1E1E">
            Read More
          </Text>
        </Stack>
        <Flex mx={4}>
          {informations.map((info, index) => (
            <Box key={index}>
              <HStack my={3}>
                <Stack mr={3}>
                  <Box p={14} bgColor={'#F4F6F9'} borderRadius={'10'}>
                    {info.icon}
                  </Box>
                </Stack>
                <Stack>
                  <Text fontSize="sm" color={'#768499'} fontWeight={500}>
                    {info.label}
                  </Text>
                  <Text fontSize="sm" fontWeight={400} mb="2">
                    {info.description}
                  </Text>
                </Stack>
              </HStack>
              {index < informations.length - 1 && <Divider />}
            </Box>
          ))}
        </Flex>

        <Text>Selected: {JSON.stringify(selected)}</Text>

        <Section
          title="Event Pricing"
          subtitle="Choose suitable category & pricing"
          mx={4}
          my={3}>
          <Radio.Group name="exampleGroup">
            {prices
              // .filter(price => price)
              .map(price => (
                <EventPricingCard
                  title={price.name}
                  subtitle="Subtitle 1"
                  originalPrice={price.originalPrice}
                  finalPrice={price.finalPrice}
                  benefits={price.benefits}
                  selected={selected && price.id === selected.id}
                  onSelect={() => setSelected(price)}
                />
              ))}
          </Radio.Group>
        </Section>
        <View py={50} />
      </ScrollView>
      {selected ? (
        <TouchableOpacity onPress={() => navigation.navigate('EventRegister')}>
          <Box
            position="absolute"
            bottom="0"
            width="100%"
            px="3"
            py="3"
            background="white"
            shadow="3">
            <Button>{'Continue with ' + selected?.name}</Button>
          </Box>
        </TouchableOpacity>
      ) : (
        false
      )}
    </VStack>
  );
}
