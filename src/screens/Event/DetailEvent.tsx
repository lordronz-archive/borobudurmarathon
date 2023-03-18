import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
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
  Center,
  Spinner,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {EventService} from '../../api/event.service';
import IconCalendar from '../../assets/icons/IconCalendar';
import IconRun from '../../assets/icons/IconRun';
import IconTag from '../../assets/icons/IconTag';
import EventPricingCard from '../../components/card/EventPricingCard';
import Header from '../../components/header/Header';
import Section from '../../components/section/Section';
import datetime from '../../helpers/datetime';
import {getErrorMessage} from '../../helpers/errorHandler';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {EVENT_TYPES, GetEventResponse} from '../../types/event.type';
import httpRequest from '../../helpers/httpRequest';
import Button from '../../components/buttons/Button';
import {buildShortDynamicLink} from '../../lib/deeplink/dynamicLink';
import RNShare, {ShareOptions} from 'react-native-share';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  parseStringToArray,
  parseUnknownDataToArray,
} from '../../helpers/parser';

type Price = {
  id: string;
  name: string;
  description: string;
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
  const [registeredEvent, setRegisteredEvent] = useState<string[]>([]);
  const [selected, setSelected] = useState<Price>();
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();

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
      description: datetime.getDateRangeString(
        event?.data.evnhRegistrationStart,
        event?.data.evnhRegistrationEnd,
        'short',
        'short',
      ),
    },
    {
      icon: <IconRun size="5" mt="0.5" color="gray.500" />,
      label: 'Running Date',
      description: datetime.getDateRangeString(
        event?.data.evnhStartDate,
        event?.data.evnhEndDate,
        'short',
        'short',
      ),
    },
  ];

  const prices: Price[] = (event?.categories || []).map(cat => ({
    id: cat.evncId,
    name: cat.evncName,
    description: cat.evncDesc
      ? cat.evncDesc
      : [
          // cat.evncVrReps,
          'Quota: ' +
            (Number(cat.evncQuotaRegistration) - Number(cat.evncUseQuota) !==
            Number(cat.evncQuotaRegistration)
              ? (
                  Number(cat.evncQuotaRegistration) - Number(cat.evncUseQuota)
                ).toLocaleString('id-ID') +
                '/' +
                Number(cat.evncQuotaRegistration).toLocaleString('id-ID')
              : Number(cat.evncQuotaRegistration).toLocaleString('id-ID')),
          datetime.getDateRangeString(
            cat.evncStartDate,
            cat.evncVrEndDate || undefined,
            'short',
            'short',
          ),
          cat.evncMaxDistance
            ? 'Distance: ' + cat.evncMaxDistance + ' km'
            : undefined,
          cat.evncMaxDistancePoint
            ? cat.evncMaxDistancePoint + ' point'
            : undefined,
        ]
          .filter(item => item)
          .join(', '),
    originalPrice: Number(cat.evncPrice),
    finalPrice: Number(cat.evncPrice),
    benefits: parseUnknownDataToArray(cat.envcBenefit).map(item => item.label),
    // benefits: [
    //   'Medal',
    //   'Jersey (Merchandise)',
    //   'Local UMKM Merchandise',
    //   'Free Ongkir',
    //   'This is Dummy Data',
    // ],
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
    setIsLoading(true);
    httpRequest.get('member_resource/transaction').then(res => {
      if (res.data) {
        const registerEventId = res.data?.linked?.mregEventId?.map(
          (item: any) => item.evnhId?.toString(),
        );
        setRegisteredEvent(registerEventId);
      }
    });
    EventService.getEvent(params.id)
      .then(res => {
        console.info('res get detail event', res);
        setEvent(res);
        setIsLoading(false);
      })
      .catch(err => {
        Toast.show({
          title: 'Failed to get event',
          description: getErrorMessage(err),
        });
        setIsLoading(false);
      });
  }, []);

  const buildLink = async () => {
    const link = await buildShortDynamicLink('events' + '/' + params.id, {
      title: event?.data.evnhName || '',
      descriptionText:
        (event?.data.evnhDescription || '').substring(0, 50) || '',
      imageUrl: event?.data.evnhThumbnail || '',
    });
    return link;
  };

  const shareHandler = async () => {
    let builtLink;
    try {
      builtLink = await buildLink();
    } catch (err) {
      Toast.show({
        title: 'Failed to build link',
        description: getErrorMessage(err),
      });
      Alert.alert('Failed to build link', getErrorMessage(err));
    }

    if (!builtLink) {
      return;
    }

    const shareOptions: ShareOptions = {
      title: 'Share',
      message: `${event?.data.evnhName} ${builtLink}`,
    };

    try {
      RNShare.open(shareOptions)
        .then(res => {
          console.log('===>Share', res);
        })
        .catch(err => {
          err && console.log(err);
        });
    } catch (error) {
      console.error('FAiled to share');
      Toast.show({
        title: 'Failed to share',
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <VStack>
      <ScrollView backgroundColor={'#fff'}>
        <Header
          title=""
          left="back"
          right={
            isLoading ? (
              <Spinner size="sm" />
            ) : (
              <IconButton
                onPress={shareHandler}
                icon={<ShareIcon color="black" />}
                borderRadius="full"
              />
            )
          }
        />
        <Stack mx={4}>
          <Text fontSize="sm" color={'#768499'} fontWeight={600} my={2}>
            {(event?.data.evnhType
              ? EVENT_TYPES[event?.data.evnhType as any].value || 'OTHER'
              : 'OTHER'
            ).toUpperCase()}
          </Text>
          <Text fontSize="xl" fontWeight={700} mb="2">
            {event?.data?.evnhName}
          </Text>
          <Text fontSize="sm" color={'#768499'} mb="2">
            Updated at Sept 24, 2022
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
          {/* <Text mt="2" fontSize={14} fontWeight="600" color="#1E1E1E">
            Read More
          </Text> */}
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

        <Section
          title="Event Pricing"
          subtitle={t('event.chooseSuitableCategory')}
          mx={4}
          my={3}>
          <Radio.Group name="exampleGroup">
            {prices
              // .filter(price => price)
              .map(price => (
                <EventPricingCard
                  key={price.id}
                  title={price.name}
                  subtitle={price.description}
                  originalPrice={price.originalPrice}
                  finalPrice={price.finalPrice}
                  benefits={price.benefits}
                  selected={selected && price.id === selected.id}
                  onSelect={() => setSelected(price)}
                />
              ))}
          </Radio.Group>
        </Section>
        <View py={100} />
      </ScrollView>

      {isLoading && (
        <Box
          position="absolute"
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          flex={1}>
          <Box
            bg="gray.300"
            opacity="0.9"
            width="100%"
            height="100%"
            position="absolute"
          />
          <Center>
            <Spinner size="lg" />
          </Center>
        </Box>
      )}

      {event && selected ? (
        <Box
          position="absolute"
          bottom="0"
          width="100%"
          px="3"
          py="3"
          background="white"
          shadow="3">
          <Button
            onPress={() => {
              if (!registeredEvent?.includes(event.data?.evnhId)) {
                navigation.navigate('EventRegister', {
                  event,
                  selectedCategoryId: selected.id,
                });
              } else {
                Toast.show({
                  title: 'Failed to register event',
                  description: 'You have registered for this event',
                });
              }
            }}>
            {'Continue with ' +
              selected?.name +
              (Number(event.data.envhBallot || 0) === 1 ? ' ~' : '')}
          </Button>
        </Box>
      ) : (
        false
      )}
    </VStack>
  );
}
