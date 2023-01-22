import {useRoute} from '@react-navigation/native';
import {
  ShareIcon,
  Box,
  IconButton,
  Radio,
  ScrollView,
  Stack,
  Text,
  ArrowBackIcon,
  Image,
  Flex,
  CheckIcon,
  HStack,
  Divider,
  Toast,
  FlatList,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {EventService} from '../../api/event.service';
import EventPricingCard from '../../components/card/EventPricingCard';
import Header from '../../components/header/Header';
import Section from '../../components/section/Section';
import {getErrorMessage} from '../../helpers/errorHandler';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {GetEventResponse} from '../../types/event.type';

export default function DetailEvent() {
  const route = useRoute();
  const params = route.params as RootStackParamList['EventDetail'];

  const [event, setEvent] = useState<GetEventResponse>();

  const categories = [
    {
      raceCategory: 'Race Category',
      raceDescription:
        'Young Talent 10 Km, Tilik Candi 21 Km, Elite Race 42 Km',
    },
    {
      raceCategory: 'Race Category',
      raceDescription:
        'Young Talent 10 Km, Tilik Candi 21 Km, Elite Race 42 Km',
    },
    {
      raceCategory: 'Race Category',
      raceDescription:
        'Young Talent 10 Km, Tilik Candi 21 Km, Elite Race 42 Km',
    },
  ];

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
    <ScrollView backgroundColor={'#fff'} pb={100}>
      <Stack mx={4}>
        <Header
          title=""
          left={
            <IconButton
              icon={<ArrowBackIcon color={'#000'} />}
              borderRadius="full"
            />
          }
          right={
            <IconButton
              icon={<ShareIcon color={'#000'} />}
              borderRadius="full"
            />
          }
        />
      </Stack>
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
        source={require('../../assets/images/FeaturedEventImage.png')}
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
        {categories.map((category, index) => (
          <Box key={index}>
            <HStack my={3}>
              <Stack mr={3}>
                <Box p={14} bgColor={'#F4F6F9'} borderRadius={'10'}>
                  <CheckIcon size="5" mt="0.5" color="emerald.500" />
                </Box>
              </Stack>
              <Stack>
                <Text fontSize="sm" color={'#768499'} fontWeight={500}>
                  {category.raceCategory}
                </Text>
                <Text fontSize="sm" fontWeight={400} mb="2">
                  {category.raceDescription}
                </Text>
              </Stack>
            </HStack>
            {index < categories.length - 1 && <Divider />}
          </Box>
        ))}
      </Flex>

      <Section
        title="Event Pricing"
        subtitle="Choose suitable category & pricing"
        mx={4}
        my={3}>
        <Radio.Group name="exampleGroup">
          {(event?.prices || [{}, {}, {}])
            .filter(price => price)
            .map(price => (
              <EventPricingCard
                title="Event 1"
                subtitle="Subtitle 1"
                value="1"
              />
            ))}
        </Radio.Group>
      </Section>
    </ScrollView>
  );
}
