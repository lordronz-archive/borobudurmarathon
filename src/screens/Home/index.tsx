import {
  Avatar,
  Badge,
  Box,
  Divider,
  Flex,
  Row,
  ScrollView,
  Text,
} from 'native-base';
import React, {useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();

import {useAuthUser} from '../../context/auth.context';
import {getFullNameFromData, getShortCodeName} from '../../helpers/name';
import SectionListEvent from './components/SectionListEvent';
import SectionFeaturedEvents from './components/SectionFeaturedEvents';
import {RefreshControl, TouchableOpacity} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/RootNavigator';
import IconInformationCircle from '../../assets/icons/IconInformationCircle';
import IconHamburgerMenu from '../../assets/icons/IconHamburgerMenu';
import AppContainer from '../../layout/AppContainer';
import useInvitation from '../../hooks/useInvitation';
import useEvent from '../../hooks/useEvent';
import {t} from 'i18next';
import useReviewInApp from '../../hooks/useReviewInApp';

export default function HomeScreen() {
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {user} = useAuthUser();
  const {
    isLoading,
    showNotification,
    fetchList: fetchListInvitation,
  } = useInvitation();
  const {fetchList: fetchListEvent} = useEvent();
  // const {initReviewInApp} = useReviewInApp();

  useEffect(() => {
    if (isFocused) {
      // fetchListInvitation();
      onRefresh();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && user) {
      const mbsdCountry = user?.linked.mbsdZmemId?.[0]?.mbsdCountry || '';
      // const mbsdProvinces = user?.linked.mbsdZmemId?.[0]?.mbsdProvinces || '';
      const mbsdProvinces = null;
      const mbsdCity = user?.linked.mbsdZmemId?.[0]?.mbsdCity || '';
      const mbsdAddress = user?.linked.mbsdZmemId?.[0]?.mbsdAddress || '';

      if (!mbsdCountry || !mbsdProvinces || !mbsdCity || !mbsdAddress) {
        navigation.navigate('UpdateLocation');
      }
    }
  }, [isFocused, user]);

  const onRefresh = () => {
    fetchListInvitation();
    fetchListEvent();
    // initReviewInApp();
  };

  return (
    <AppContainer>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }>
        <Box backgroundColor={'#fff'}>
          <Flex
            mx="4"
            justify={'space-between'}
            direction="row"
            alignItems="center">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Main', {screen: t('tab.more')})
              }>
              <Flex
                alignContent={'center'}
                direction="row"
                alignItems={'center'}>
                <Box bgColor={'#EB1C23'} w={2} h={10} my={4} ml={-4} />
                <Avatar
                  bg="gray.400"
                  mx={2}
                  source={{
                    uri:
                      user?.data &&
                      user?.data.length > 0 &&
                      user?.data[0]?.zmemPhoto
                        ? `https://openpub.oss-ap-southeast-5.aliyuncs.com/${user?.data[0]?.zmemPhoto}`
                        : undefined,
                  }}>
                  {getShortCodeName(user?.data[0].zmemFullName || '')}
                </Avatar>
                <Text fontSize={'lg'} mx={2} fontWeight={700}>
                  {t('Hello')},{' '}
                  {getFullNameFromData(user)?.length > 14
                    ? getFullNameFromData(user).substring(0, 12) + '...'
                    : getFullNameFromData(user)}
                </Text>
              </Flex>
            </TouchableOpacity>
            <Row>
              <TouchableOpacity
                style={{padding: 5}}
                onPress={() => navigation.navigate('FAQ')}>
                <IconInformationCircle size="xl" color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{padding: 7}}
                onPress={() => {
                  navigation.navigate('Main', {
                    screen: t('tab.more'),
                  });
                }}>
                {showNotification && (
                  <Badge
                    colorScheme="danger"
                    rounded={9999}
                    mb={-1}
                    mr={-1}
                    zIndex={1}
                    variant="solid"
                    top="7px"
                    right="7px"
                    w={3}
                    h={3}
                    p={0}
                    position={'absolute'}
                  />
                )}
                <IconHamburgerMenu size="lg" color="black" />
              </TouchableOpacity>
            </Row>
          </Flex>

          {/* <SummaryRecord /> */}

          <Divider
            mt="2"
            mb="2"
            _light={{
              bg: 'muted.300',
            }}
            _dark={{
              bg: 'muted.50',
            }}
          />

          <SectionFeaturedEvents />

          <SectionListEvent />
        </Box>
      </ScrollView>
    </AppContainer>
  );
}
