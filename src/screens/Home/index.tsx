import {Avatar, Box, Divider, Flex, Row, ScrollView, Text} from 'native-base';
import React, {useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();

import useInit from '../../hooks/useInit';
import {useAuthUser} from '../../context/auth.context';
import {getShortCodeName} from '../../helpers/name';
import SectionListEvent from './components/SectionListEvent';
import I18n from '../../lib/i18n';
import SectionFeaturedEvents from './components/SectionFeaturedEvents';
import {TouchableOpacity} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/RootNavigator';
import IconInformationCircle from '../../assets/icons/IconInformationCircle';
import SummaryRecord from './components/SummaryRecord';
import IconHamburgerMenu from '../../assets/icons/IconHamburgerMenu';

export default function HomeScreen() {
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {checkLogin} = useInit();
  const {user} = useAuthUser();

  useEffect(() => {
    if (isFocused) {
      checkLogin();
    }
  }, [isFocused]);

  return (
    <ScrollView>
      <Box backgroundColor={'#fff'}>
        <Flex
          mx="4"
          justify={'space-between'}
          direction="row"
          alignItems="center">
          <TouchableOpacity
            onPress={() => navigation.navigate('Main', {screen: 'Profile'})}>
            <Flex alignContent={'center'} direction="row" alignItems={'center'}>
              <Box bgColor={'#EB1C23'} w={2} h={10} my={4} ml={-4} />
              <Avatar
                bg="gray.400"
                mx={2}
                source={{
                  uri: user?.data[0]?.zmemPhoto
                    ? `https://openpub.oss-ap-southeast-5.aliyuncs.com/${user?.data[0]?.zmemPhoto}`
                    : undefined,
                }}>
                {getShortCodeName(user?.data[0].zmemFullName || '')}
              </Avatar>
              <Text fontSize={'lg'} mx={2} fontWeight={700}>
                {I18n.t('Hello')}, {user?.data[0].zmemFullName}
              </Text>
            </Flex>
          </TouchableOpacity>
          <Row>
            <TouchableOpacity style={{padding: 5}}>
              <IconInformationCircle size="xl" color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{padding: 7}}
              onPress={() => {
                navigation.navigate('Main', {
                  screen: 'More',
                });
              }}>
              <IconHamburgerMenu size="lg" color="black" />
            </TouchableOpacity>
          </Row>
        </Flex>

        <SummaryRecord />

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
        {/* <Section title="Featured Events" mx="4" my={3} /> */}

        <SectionFeaturedEvents />

        <SectionListEvent />
      </Box>
    </ScrollView>
  );
}
