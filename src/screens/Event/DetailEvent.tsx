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
  Flex,
  HStack,
  Divider,
  Toast,
  View,
  VStack,
  Alert as NBAlert,
  Spinner,
  WarningOutlineIcon,
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
import {parseUnknownDataToArray} from '../../helpers/parser';
import IconLocation from '../../assets/icons/IconLocation';
import BannerFull from '../../components/carousel/BannerFull';
import AppContainer from '../../layout/AppContainer';
import LoadingBlock from '../../components/loading/LoadingBlock';
import {useAuthUser} from '../../context/auth.context';

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
  const {isVerified} = useAuthUser();

  const [event, setEvent] = useState<GetEventResponse>();
  const [registeredEvent, setRegisteredEvent] = useState<any>();
  const [selected, setSelected] = useState<Price>();
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();

  const informations: {icon: any; label: string; description: string}[] = [
    {
      icon: <IconTag size="5" mt="0.5" color="gray.500" />,
      label: t('event.raceCategory'),
      description: event?.data.envhCategory
        ? event?.data.envhCategory
        : (event?.categories || []).map(cat => cat.evncName).join(', '),
    },
    {
      icon: <IconCalendar size="5" mt="0.5" color="gray.500" />,
      label: t('event.registrationDate'),
      description: datetime.getDateRangeString(
        event?.data.evnhRegistrationStart,
        event?.data.evnhRegistrationEnd,
        'short',
        'short',
      ),
    },
    {
      icon: <IconRun size="5" mt="0.5" color="gray.500" />,
      label: t('event.runningDate'),
      description: datetime.getDateRangeString(
        event?.data.evnhStartDate,
        event?.data.evnhEndDate,
        'short',
        'short',
      ),
    },
    {
      icon: <IconLocation size="5" mt="0.5" color="gray.500" />,
      label: t('event.place'),
      description: event?.data.evnhPlace || '',
    },
  ];

  const prices: Price[] = (event?.categories || []).map(cat => {
    const earlyBirdPrice = (event?.prices || []).find(
      price => price.evcpEvncId === cat.evncId,
    );
    return {
      id: cat.evncId,
      name: cat.evncName,
      description: cat.evncDesc
        ? cat.evncDesc
        : [
            // cat.evncVrReps,
            // 'Quota: ' +
            //   (Number(cat.evncQuotaRegistration) - Number(cat.evncUseQuota) !==
            //   Number(cat.evncQuotaRegistration)
            //     ? (
            //         Number(cat.evncQuotaRegistration) - Number(cat.evncUseQuota)
            //       ).toLocaleString('id-ID') +
            //       '/' +
            //       Number(cat.evncQuotaRegistration).toLocaleString('id-ID')
            //     : Number(cat.evncQuotaRegistration).toLocaleString('id-ID')),
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
      finalPrice: earlyBirdPrice
        ? Number(earlyBirdPrice.evcpPrice)
        : Number(cat.evncPrice),
      benefits: parseUnknownDataToArray(cat.evncBenefit).map(
        item => item.label,
      ),
      // benefits: [
      //   'Medal',
      //   'Jersey (Merchandise)',
      //   'Local UMKM Merchandise',
      //   'Free Ongkir',
      //   'This is Dummy Data',
      // ],
    };
  });
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
    EventService.getEvent(params.id)
      .then(resEvent => {
        console.info('res get detail event', JSON.stringify(resEvent));
        setEvent(resEvent);

        httpRequest
          .get('member_resource/transaction')
          .then(resTransaction => {
            if (resTransaction.data) {
              const findEventRegister =
                resTransaction.data?.linked?.mregTrnsId?.find(
                  (item: any) =>
                    item.trnsEventId?.toString() ===
                      resEvent.data?.evnhId?.toString() &&
                    (item.trnsConfirmed === '1' ||
                      new Date(item.trnsExpiredTime)?.getTime() >
                        new Date().getTime(),
                    resEvent.data?.evnhBallot === '1'),
                );

              if (findEventRegister) {
                const registeredEvent = resTransaction?.data?.data?.find(
                  (item: any) =>
                    item.mregOrderId === findEventRegister.trnsRefId,
                );
                if (registeredEvent) {
                  setRegisteredEvent(registeredEvent);
                }
              }
            }
          })
          .catch(err => {
            console.info('error check registered event', err);
          });
      })
      .catch(err => {
        Toast.show({
          title: 'Failed to get event',
          description: getErrorMessage(err),
        });
      })
      .finally(() => {
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
    <AppContainer>
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
          {!isVerified && (
            <NBAlert bgColor="warning.300">
              <HStack alignItems="center">
                <WarningOutlineIcon color="black" />
                <Text ml="1" fontSize="xs">
                  {t('profile.alertNotVerifiedMessage')}
                </Text>
              </HStack>
            </NBAlert>
          )}

          <Stack mx={4}>
            <Text fontSize="sm" color={'#768499'} fontWeight={600} my={2}>
              {(event?.data.evnhType
                ? EVENT_TYPES[event?.data.evnhType as any].value || 'OTHER'
                : 'OTHER'
              ).toUpperCase() +
                ' ' +
                (Number(event?.data.envhFuture || 0) === 1 ? '~' : '')}
            </Text>
            <Text fontSize="xl" fontWeight={700} mb="2">
              {event?.data?.evnhName}
            </Text>
            <Text fontSize="sm" color={'#768499'} mb="2">
              Updated at{' '}
              {datetime.getDateString(
                event?.data.evnhRegistrationStart,
                'short',
              )}
            </Text>
          </Stack>
          {/* <Image
          w={'100%'}
          minH={250}
          alt="fallback text"
          source={
            event?.data.evnhThumbnail
              ? {uri: event?.data.evnhThumbnail}
              : require('../../assets/images/FeaturedEventImage.png')
          }
        /> */}

          {event?.banner && event?.banner.length > 0 ? (
            <BannerFull
              entries={
                event.banner.map(item => ({
                  title: item.eimgName,
                  imageUrl: item.eimgUrlImage,
                }))
                // (event?.data ? [event?.data] : [])
                // .map(item => ({
                //   title: item.evnhName,
                //   imageUrl: item.evnhThumbnail,
                // }))
              }
            />
          ) : (
            false
          )}

          <Stack mx={4} mb={4}>
            {event?.data?.evnhDescription ? (
              <Text fontSize="sm" color={'#1E1E1E'} mt={3}>
                {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
          maximus pulvinar ligula vel interdum. Duis rutrum, lacus non
          consectetur porta, nulla neque tristique justo, vitae sodales mauris
          nisl et quam. Etiam vel feugiat libero. Cras hendrerit leo ac turpis
          sodales, suscipit dignissim leo ornare. */}
                {event?.data?.evnhDescription || 'No description'}
              </Text>
            ) : (
              false
            )}
            {/* <Text mt="2" fontSize={14} fontWeight="600" color="#1E1E1E">
            Read More
          </Text> */}
          </Stack>
          <Flex mx={4}>
            {informations.map((info, index) => (
              <Box key={index}>
                <HStack my={3} space={3}>
                  <Stack>
                    <Box p={14} bgColor={'#F4F6F9'} borderRadius={'10'}>
                      {info.icon}
                    </Box>
                  </Stack>
                  <Stack w="80%">
                    <Text fontSize="sm" color={'#768499'} fontWeight={500}>
                      {info.label}
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight={400}
                      mb="2"
                      overflowX="auto">
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
            subtitle={t('event.chooseSuitableCategory') || ''}
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

        {isLoading && <LoadingBlock style={{opacity: 0.7}} />}

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
              disabled={!isVerified}
              onPress={() => {
                if (!registeredEvent) {
                  navigation.navigate('EventRegister', {
                    event,
                    selectedCategoryId: selected.id,
                  });
                } else {
                  navigation.navigate('MyEventsDetail', {
                    transactionId: registeredEvent.mregOrderId,
                    eventId: registeredEvent.links?.mregEventId,
                    isBallot: registeredEvent.mregType === 'MB' ? true : false,
                    regStatus: registeredEvent.mregStatus,
                  });
                }
              }}>
              {'Continue with ' +
                selected?.name +
                (Number(event.data.evnhBallot || 0) === 1 ? ' ~' : '')}
            </Button>
            {!isVerified && (
              <Text color="warning.500" textAlign="center">
                {t('profile.alertNotVerifiedMessage')}
              </Text>
            )}
          </Box>
        ) : (
          false
        )}
      </VStack>
    </AppContainer>
  );
}
