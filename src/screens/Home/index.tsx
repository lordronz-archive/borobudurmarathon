import {Avatar, Box, Divider, Flex, Icon, ScrollView, Text} from 'native-base';
import React from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/RootNavigator';
import IconInformationCircle from '../../assets/icons/IconInformationCircle';
import SummaryRecord from './components/SummaryRecord';

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const _init = useInit();
  const {user} = useAuthUser();

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
              <Avatar bg="gray.400" mx={2}>
                {getShortCodeName(user?.data[0].zmemFullName || '')}
              </Avatar>
              <Text fontSize={'lg'} mx={2} fontWeight={700}>
                {I18n.t('Hello')}, {user?.data[0].zmemFullName}
              </Text>
            </Flex>
          </TouchableOpacity>
          <TouchableOpacity>
            <IconInformationCircle size="xl" color="black" />
          </TouchableOpacity>
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
