import {Box, Divider, Flex, List, Radio, Text, VStack} from 'native-base';
import React from 'react';
import CategoryButton from '../../components/buttons/CategoryButton';
import EventCard from '../../components/card/EventCard';
import EventPricingCard from '../../components/card/EventPricingCard';
import Section from '../../components/section/Section';
import useInit from '../../hooks/useInit';

export default function HomeScreen() {
  // const _init = useInit();

  return (
    <Box backgroundColor={'#fff'}>
      <Flex mx="3" direction="row" justify="space-evenly" alignItems={'center'}>
        <VStack alignItems="center">
          <Text py="2" color={'#768499'} fontSize={12}>
            Time
          </Text>
          <Text py="1" fontWeight={500} fontSize={18}>
            00:00:00
          </Text>
        </VStack>
        <Divider
          orientation="vertical"
          mx="3"
          h={12}
          _light={{
            bg: 'muted.300',
          }}
          _dark={{
            bg: 'muted.50',
          }}
        />
        <VStack alignItems="center">
          <Text py="2" color={'#768499'} fontSize={12}>
            Distance
          </Text>
          <Text py="1" fontWeight={500} fontSize={18}>
            0{' '}
            <Text fontWeight={600} color={'#768499'} fontSize={12}>
              km
            </Text>
          </Text>
        </VStack>
        <Divider
          orientation="vertical"
          h={12}
          mx="3"
          _light={{
            bg: 'muted.300',
          }}
          _dark={{
            bg: 'muted.50',
          }}
        />
        <VStack alignItems="center">
          <Text py="2" color={'#768499'} fontSize={12}>
            Pace
          </Text>
          <Text py="1" fontWeight={500} fontSize={18}>
            00:00
            <Text fontWeight={600} color={'#768499'} fontSize={12}>
              /km
            </Text>
          </Text>
        </VStack>
      </Flex>
      <Divider
        my="2"
        _light={{
          bg: 'muted.300',
        }}
        _dark={{
          bg: 'muted.50',
        }}
      />
      <Section title="Featured Events" mx="4">
        {/* <Radio.Group name="exampleGroup">
          <EventPricingCard title="Event 1" subtitle="Subtitle 1" value="1" />
          <EventPricingCard title="Event 1" subtitle="Subtitle 1" value="2" />

        </Radio.Group> */}
      </Section>
      <Section title="Our Events" mx="4" mr="-4">
        <CategoryButton
          categories={['All Event', 'Offline', 'Race', 'V', 'Other']}
        />
        <EventCard
          title="Event 1"
          place="Place 1"
          date="Date 1"
          image={require('../../assets/images/FeaturedEventImage.png')}
          isAvailable={false}
        />
      </Section>
    </Box>
  );
}
