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
} from 'native-base';
import React from 'react';
import EventPricingCard from '../../components/card/EventPricingCard';
import Header from '../../components/header/Header';
import Section from '../../components/section/Section';

export default function DetailEvent() {
  return (
    <Box backgroundColor={'#fff'}>
      <ScrollView>
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
            OFFLINE
          </Text>
          <Text fontSize="xl" fontWeight={700} mb="2">
            Elite Runner 42 KM Borobudur Marathon 2022
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            maximus pulvinar ligula vel interdum. Duis rutrum, lacus non
            consectetur porta, nulla neque tristique justo, vitae sodales mauris
            nisl et quam. Etiam vel feugiat libero. Cras hendrerit leo ac turpis
            sodales, suscipit dignissim leo ornare.
          </Text>
          <Text mt="2" fontSize={14} fontWeight="600" color="#1E1E1E">
            Read More
          </Text>
        </Stack>
        <Flex mx={4}>
          <HStack my={3}>
            <Stack mr={3}>
              <Box p={14} bgColor={'#F4F6F9'} borderRadius={'10'}>
                <CheckIcon size="5" mt="0.5" color="emerald.500" />
              </Box>
            </Stack>
            <Stack>
              <Text fontSize="sm" color={'#768499'} fontWeight={500}>
                Race Category
              </Text>
              <Text fontSize="sm" fontWeight={400} mb="2">
                Young Talent 10 Km, Tilik Candi 21 Km, Elite Race 42 Km
              </Text>
            </Stack>
          </HStack>
          <Divider />
          <HStack my={3}>
            <Stack mr={3}>
              <Box p={14} bgColor={'#F4F6F9'} borderRadius={'10'}>
                <CheckIcon size="5" mt="0.5" color="emerald.500" />
              </Box>
            </Stack>
            <Stack>
              <Text fontSize="sm" color={'#768499'} fontWeight={500}>
                Race Category
              </Text>
              <Text fontSize="sm" fontWeight={400} mb="2">
                Young Talent 10 Km, Tilik Candi 21 Km, Elite Race 42 Km
              </Text>
            </Stack>
          </HStack>
          <Divider />
          <HStack my={3}>
            <Stack mr={3}>
              <Box p={14} bgColor={'#F4F6F9'} borderRadius={'10'}>
                <CheckIcon size="5" mt="0.5" color="emerald.500" />
              </Box>
            </Stack>
            <Stack>
              <Text fontSize="sm" color={'#768499'} fontWeight={500}>
                Race Category
              </Text>
              <Text fontSize="sm" fontWeight={400} mb="2">
                Young Talent 10 Km, Tilik Candi 21 Km, Elite Race 42 Km
              </Text>
            </Stack>
          </HStack>
        </Flex>
        <Section
          title="Event Pricing"
          subtitle="Choose suitable category & pricing"
          mx={4}
          my={3}>
          <Radio.Group name="exampleGroup">
            <EventPricingCard title="Event 1" subtitle="Subtitle 1" value="1" />
            <EventPricingCard title="Event 1" subtitle="Subtitle 1" value="2" />
          </Radio.Group>
        </Section>
      </ScrollView>
    </Box>
  );
}
