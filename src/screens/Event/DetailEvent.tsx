import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
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
import {EInvitationStatus, GetEventResponse} from '../../types/event.type';
import Button from '../../components/buttons/Button';
import {buildShortDynamicLink} from '../../lib/deeplink/dynamicLink';
import RNShare, {ShareOptions} from 'react-native-share';
import {Alert, RefreshControl} from 'react-native';
import {useTranslation} from 'react-i18next';
import {parseUnknownDataToArray} from '../../helpers/parser';
import IconLocation from '../../assets/icons/IconLocation';
import BannerFull from '../../components/carousel/BannerFull';
import AppContainer from '../../layout/AppContainer';
import LoadingBlock from '../../components/loading/LoadingBlock';
import {useAuthUser} from '../../context/auth.context';
import {handleErrorMessage} from '../../helpers/apiErrors';
import useInit from '../../hooks/useInit';
import {GetTransactionsResponse} from '../../types/transactions.type';
import {getTextBasedOnLanguage} from '../../helpers/text';
import i18next from 'i18next';
import {
  getEventCategoryQuotaStatus,
  getEventQuotaStatus,
  getEventRegistrationStatus,
  getEventTypeName,
  getInvitationStatus,
  isAvailableForRegister,
} from '../../helpers/event';
import useInvitation from '../../hooks/useInvitation';
import { InvitationProperties, IregEvnhID } from '../../types/invitation.type';
import EventStatusBadge from '../../components/card/EventStatusBadge';

type Price = {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  finalPrice: number;
  benefits: string[];
  status: 'SOLDOUT' | 'OPEN';
};
export default function DetailEvent() {
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as RootStackParamList['EventDetail'];
  const {isVerified} = useAuthUser();
  const {getProfile, isLoadingProfile} = useInit();

  const [event, setEvent] = useState<GetEventResponse>();
  const [registeredEvent, setRegisteredEvent] = useState<any>();
  const {invitations} = useInvitation();
  const [selected, setSelected] = useState<Price>();
  const [isLoading, setIsLoading] = useState(false);
  const [evnInvitation, setEvnInvitation] = useState<InvitationProperties>();
  const {t} = useTranslation();

  // console.info('=============================================');
  // const now = new Date();
  // console.info('===> moment()', moment(now));
  // console.info('new Date().toISOString()', now.toISOString());
  // console.info('moment(now)', moment(now));
  // const start = '2023-04-17 15:00:00';
  // const end = '2023-04-18 23:59:59';
  // console.info('moment(start)', moment(start));
  // console.info('moment(end)', moment(end));
  // console.info('isBetween', moment(now).isBetween(start, end));
  // console.info('=============================================');

  const informations: {icon: any; label: string; description: string}[] = [
    {
      icon: <IconTag size="5" mt="0.5" color="gray.500" />,
      label: t('event.raceCategory'),
      description: event?.data.evnhCategory ? event?.data.evnhCategory : '',
      // : (event?.categories || []).map(cat => cat.evncName).join(', '),
    },
    {
      icon: <IconCalendar size="5" mt="0.5" color="gray.500" />,
      label: t('event.registrationDate'),
      description:
        datetime.getDateTimeRangeString(
          event?.data.evnhRegistrationStart,
          event?.data.evnhRegistrationEnd,
          'short',
          'short',
        ) + ' WIB',
    },
    {
      icon: <IconRun size="5" mt="0.5" color="gray.500" />,
      label: t('event.runningDate'),
      description:
        datetime.getDateTimeRangeString(
          event?.data.evnhStartDate,
          event?.data.evnhEndDate,
          'short',
          'short',
        ) + ' WIB',
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
    console.info('>>> cat.evncBenefit', cat.evncBenefit);
    console.info('typeof cat.evncBenefit', typeof cat.evncBenefit);
    const parsed = parseUnknownDataToArray(cat.evncBenefit);
    console.info('parsed', parsed);
    console.info('parsed.length', parsed.length);
    return {
      id: cat.evncId,
      name: cat.evncName,
      description: cat.evncDesc
        ? getTextBasedOnLanguage(cat.evncDesc, i18next.language)
        : '',
      originalPrice: Number(cat.evncPrice),
      finalPrice: earlyBirdPrice
        ? Number(earlyBirdPrice.evcpPrice)
        : Number(cat.evncPrice),
      benefits: parsed.map(item =>
        getTextBasedOnLanguage(item.label, i18next.language),
      ),
      status: getEventCategoryQuotaStatus({
        evncHold: cat.evncHold,
        evncQuotaRegistration: cat.evncQuotaRegistration,
      }),
    };
  });

  const onRefresh = () => {
    fetchDetail();
    getProfile();
  };

  useEffect(() => {
    onRefresh();
  }, [isFocused]);

  const fetchDetail = async () => {
    setIsLoading(true);
    EventService.getEvent(params.id)
      .then(resEvent => {
        console.info('res get detail event', JSON.stringify(resEvent));
        setEvent(resEvent);
        const inv = invitations.find(
          v =>
            v.links.iregEvnhId.toString() === resEvent.data.evnhId.toString(),
        );
        setEvnInvitation(inv);
        EventService.getTransaction()
          .then((resTransaction: {data: GetTransactionsResponse}) => {
            if (resTransaction.data) {
              console.info(
                'resTransaction.data',
                JSON.stringify(resTransaction.data),
              );
              // const findEventRegister =
              //   resTransaction.data?.linked?.mregTrnsId?.find(
              //     (item: any) =>
              //       item.trnsEventId?.toString() ===
              //         resEvent.data?.evnhId?.toString() &&
              //       (item.trnsConfirmed === '1' ||
              //         new Date(item.trnsExpiredTime)?.getTime() >
              //           new Date().getTime(),
              //       resEvent.data?.evnhBallot === '1'),
              //   );
              (resTransaction.data.linked?.mregTrnsId || []).sort(
                (a, b) => b.id - a.id,
              );
              const findEventRegister =
                resTransaction.data?.linked?.mregTrnsId?.find(
                  (item: any) =>
                    item.trnsEventId?.toString() ===
                    resEvent.data?.evnhId?.toString(),
                );

              if (findEventRegister) {
                const findRegisteredEvent = resTransaction?.data?.data?.find(
                  (item: any) =>
                    item.mregOrderId === findEventRegister.trnsRefId,
                );
                console.log('REGISTERED EVENT', findRegisteredEvent);
                if (findRegisteredEvent) {
                  setRegisteredEvent(findRegisteredEvent);
                }
              }
            }
            setIsLoading(false);
          })
          .catch(err => {
            console.info('error check registered event', err);
            const error = handleErrorMessage(
              err,
              t('error.failedToGetTransactions'),
              {
                ignore404: true,
              },
            );

            if (!error) {
              setIsLoading(false);
            }
          });
      })
      .catch(err => {
        console.info('err get event detail', JSON.stringify(err));
        handleErrorMessage(err, t('error.failedToGetEvent'));
        navigation.goBack();
      });
  };

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

  const status = getEventRegistrationStatus(
    event?.data?.evnhRegistrationStart,
    event?.data?.evnhRegistrationEnd,
    event?.data?.evnhStartDate,
    event?.data?.evnhEndDate,
  );

  const quotaStatus = getEventQuotaStatus(
    {
      evnhQuotaRegistration: event?.data?.evnhQuotaRegistration,
    },
    (event?.categories || []).map(price => ({evncHold: price.evncHold})),
  );

  const isRegistered = registeredEvent ? true : false;
  const hasInvitationForThisEvent = evnInvitation ? true : false;
  // const hasInvitationForThisEvent = true;

  const invitationStatus = hasInvitationForThisEvent
    ? getInvitationStatus({
        iregExpired: evnInvitation?.iregExpired,
        iregIsUsed: evnInvitation?.iregIsUsed,
      })
    : undefined;
  // const invitationStatus = EInvitationStatus.INVITED;
  console.info('invitationStatus', invitationStatus);

  // const IregEvncId = Number(evnInvitation?.links.iregEvncId);
  const iregEvncId = 1377;

  const isCanRegisterForCategory = (evncId: string) =>
    isAvailableForRegister({
      isRegistered,
      access: event?.access,
      eventStatus: status,
      invitationStatus,
      iregEvncId,
      categories: [Number(evncId)],
    });

  const isCanRegister = isAvailableForRegister({
    isRegistered,
    access: event?.access,
    eventStatus: status,
    invitationStatus,
    categories: prices.map(prc => Number(prc.id)),
    iregEvncId,
  });

  const isDisabled = (price: any) => {
    if (isCanRegisterForCategory(price.id)) {
      return false;
    } else {
      return (
        !isCanRegister ||
        price.status === 'SOLDOUT' ||
        quotaStatus === 'SOLDOUT'
      );
    }
  };

  return (
    <AppContainer>
      <VStack>
        <ScrollView
          backgroundColor={'#fff'}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }>
          <Header
            title=""
            left="back"
            right={
              isLoading ? (
                <Spinner size="sm" mr="3" />
              ) : (
                <IconButton
                  onPress={shareHandler}
                  icon={<ShareIcon color="black" />}
                  borderRadius="full"
                  mr="2"
                  p="2"
                />
              )
            }
          />

          {event && !event?.access ? (
            <NBAlert bgColor="warning.300" py="5">
              <VStack alignItems="center">
                <WarningOutlineIcon color="gray.600" size="xl" mb="2" />
                <Text ml="1" fontSize="sm" textAlign="center" color="gray.700">
                  {getTextBasedOnLanguage(event.notif || '')}
                </Text>
              </VStack>
            </NBAlert>
          ) : !isVerified ? (
            <NBAlert bgColor="warning.300">
              <HStack alignItems="center">
                <WarningOutlineIcon color="gray.600" />
                <Text ml="1" fontSize="xs" color="gray.700">
                  {t('profile.alertNotVerifiedMessage')}
                </Text>
              </HStack>
            </NBAlert>
          ) : (
            false
          )}

          <Stack mx={4}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text
                fontSize="sm"
                color={'#768499'}
                fontWeight={600}
                my={2}
                mr="2">
                {getEventTypeName({
                  evnhType: event?.data.evnhType,
                  evnhBallot: event?.data.evnhBallot,
                })}
              </Text>
              <EventStatusBadge eventStatus={status} />
            </HStack>

            <Text fontSize="xl" fontWeight={700} mb="2">
              {event?.data?.evnhName}
            </Text>
            {/* <Text fontSize="sm" color={'#768499'} mb="2">
              Updated at{' '}
              {datetime.getDateString(
                event?.data.evnhRegistrationStart,
                'short',
              )}
            </Text> */}
          </Stack>
          {/* <Image
          w={'100%'}
          minH={250}
          alt="fallback text"
          source={
            event?.data.evnhThumbnail
              ? {uri: event?.data.evnhThumbnail}
              : require('../../assets/images/no-image.png')
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
                {getTextBasedOnLanguage(
                  event?.data?.evnhDescription,
                  i18next.language,
                ) || 'No description'}
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
                    <Text
                      fontSize="sm"
                      color={'#768499'}
                      fontWeight={500}
                      mb="0.5">
                      {info.label}
                    </Text>
                    {info.description ? (
                      <Text
                        fontSize="sm"
                        fontWeight={400}
                        mb="2"
                        overflowX="auto">
                        {info.description}
                      </Text>
                    ) : (
                      <Text color="gray.500" italic>
                        ~ Not Set
                      </Text>
                    )}
                  </Stack>
                </HStack>
                {index < informations.length - 1 && <Divider />}
              </Box>
            ))}
          </Flex>

          {prices.length > 0 && (
            <Section
              title={t('event.eventPricing')}
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
                      hasActiveInvitation={
                        hasInvitationForThisEvent &&
                        isCanRegisterForCategory(price.id)
                      }
                      disabled={isDisabled(price)}
                      status={
                        quotaStatus === 'SOLDOUT' || price.status === 'SOLDOUT'
                          ? 'SOLDOUT'
                          : price.status
                      }
                    />
                  ))}
              </Radio.Group>
            </Section>
          )}
          <View py={100} />
        </ScrollView>

        {(isLoading || isLoadingProfile) && (
          <LoadingBlock style={{opacity: 0.7}} />
        )}

        {isCanRegister && event && selected ? (
          <Box
            position="absolute"
            bottom="0"
            width="100%"
            px="3"
            py="3"
            background="white"
            shadow="3">
            <Button
              disabled={
                !isVerified || Number(event?.data?.evnhRegistrationStatus) === 0
              }
              isLoading={isLoading}
              onPress={() => {
                navigation.navigate('EventRegister', {
                  event,
                  selectedCategoryId: selected.id,
                });
              }}>
              {t('continueWith') + ' ' + selected?.name}
            </Button>
            {!isVerified && (
              <Text color="warning.500" textAlign="center">
                {t('profile.alertNotVerifiedMessage')}
              </Text>
            )}
          </Box>
        ) : event && isRegistered ? (
          <Box
            position="absolute"
            bottom="0"
            width="100%"
            px="3"
            py="3"
            background="white"
            shadow="3">
            <Text color="warning.500" textAlign="center" mb="2">
              {t('message.youHaveRegisteredToThisEvent')}
            </Text>
            <Button
              disabled={
                !isVerified || Number(event?.data?.evnhRegistrationStatus) === 0
              }
              isLoading={isLoading}
              onPress={() => {
                navigation.navigate('MyEventsDetail', {
                  transactionId: registeredEvent.mregOrderId,
                  // eventId: registeredEvent.links?.mregEventId,
                  // isBallot: registeredEvent.mregType === 'MB' ? true : false,
                  // regStatus: registeredEvent.mregStatus,
                });
              }}>
              {t('event.viewDetail')}
            </Button>
          </Box>
        ) : event && selected ? (
          <Box
            position="absolute"
            bottom="0"
            width="100%"
            px="3"
            py="3"
            background="white"
            shadow="3">
            <Button
              disabled={
                !isVerified || Number(event?.data?.evnhRegistrationStatus) === 0
              }
              isLoading={isLoading}
              onPress={() => {
                navigation.navigate('EventRegister', {
                  event,
                  selectedCategoryId: selected.id,
                });
              }}>
              {t('continueWith') + ' ' + selected?.name}
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
