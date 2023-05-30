import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Box, FlatList, Flex, Image, Spinner, Text} from 'native-base';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import EventCard from '../../../components/card/EventCard';
import datetime from '../../../helpers/datetime';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {
  getEventRegistrationStatus,
  getInvitationStatus,
} from '../../../helpers/event';
import useInvitation from '../../../hooks/useInvitation';
import {InvitationProperties} from '../../../types/invitation.type';

export default function SectionListInvitation() {
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();
  const {isLoading, invitations, fetchList, setInvitationsStorage} =
    useInvitation();

  useEffect(() => {
    if (isFocused) {
      fetchList().then(() => setInvitationsStorage());
    }
  }, [isFocused]);

  const _renderItem = ({item}: {item: InvitationProperties}) => {
    const invitationStatus = getInvitationStatus({
      iregIsUsed: item.iregIsUsed,
      iregExpired: item.iregExpired,
    });

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('EventDetail', {
            id: Number(item.links.iregEvnhId),
          })
        }>
        <EventCard
          title={item.linked?.iregEvnhId.evnhName || '-'}
          place={item.linked?.iregEvnhId.evnhPlace || '-'}
          date={datetime.getDateRangeString(
            item.linked?.iregEvnhId.evnhStartDate,
            item.linked?.iregEvnhId.evnhEndDate,
            'short',
            'short',
          )}
          image={
            item.linked?.iregEvnhId.evnhThumbnail
              ? {uri: item.linked?.iregEvnhId.evnhThumbnail}
              : require('../../../assets/images/no-image.png')
          }
          status={getEventRegistrationStatus(
            item.linked?.iregEvnhId.evnhRegistrationStart,
            item.linked?.iregEvnhId.evnhRegistrationEnd,
            item.linked?.iregEvnhId.evnhStartDate,
            item.linked?.iregEvnhId.evnhEndDate,
          )}
          isInvitation={true}
          isFree={item.iregIsFree.toString() === '1'}
          invitationStatus={invitationStatus}
        />
      </TouchableOpacity>
    );
  };

  const _renderEmpty = () => {
    return (
      <Flex my={5} flex={1}>
        <Image
          source={require('../../../assets/images/hiasan-not-found.png')}
          alignSelf={'center'}
          mb={1}
          alt="Data empty"
        />
        <Text textAlign={'center'} fontSize={'lg'} fontWeight={'bold'} mb={1}>
          {t('dataEmpty')}
        </Text>
        <Text textAlign={'center'} fontSize={'sm'} color={'gray.400'}>
          {t('dataEmptyDesc')}
        </Text>
      </Flex>
    );
  };

  return (
    <FlatList
      refreshing={isLoading}
      data={invitations}
      ListEmptyComponent={() =>
        isLoading ? (
          <Box height={100}>
            <Spinner />
          </Box>
        ) : (
          _renderEmpty()
        )
      }
      renderItem={_renderItem}
      keyExtractor={item => item.linked?.iregEvnhId.evnhId.toString() || '1'}
      _contentContainerStyle={{px: 4, py: 3}}
    />
  );
}
