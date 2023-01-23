import {
  Avatar,
  Box,
  Divider,
  Flex,
  Icon,
  InfoOutlineIcon,
  ScrollView,
  Text,
} from 'native-base';
import React from 'react';
import Section from '../../components/section/Section';
import Ionicons from 'react-native-vector-icons/Ionicons';

import useInit from '../../hooks/useInit';
import {useAuthUser} from '../../context/auth.context';
import {getShortCodeName} from '../../helpers/name';
import SectionListEvent from './components/SectionListEvent';
import I18n from '../../lib/i18n';

export default function HomeScreen() {
  const _init = useInit();
  const {user} = useAuthUser();

  return (
    <ScrollView>
      <Box backgroundColor={'#fff'}>
        <Flex mx="4" justify={'space-between'} direction="row" alignItems="center">
          <Flex alignContent={'center'} direction="row" alignItems={'center'}>
            <Box bgColor={'#EB1C23'} w={2} h={10} my={4} ml={-4} />
            <Avatar bg="gray.400" mx={2}>
              {getShortCodeName(user?.data[0].zmemFullName || '')}
            </Avatar>
            <Text fontSize={'lg'} mx={2} fontWeight={600}>
              {I18n.t('Hello')}, {user?.data[0].zmemFullName}
            </Text>
          </Flex>
          <Icon
            as={Ionicons}
            name="help-circle-outline"
            size="xl"
            color="black"
          />
        </Flex>

        {/* <SummaryRecord /> */}

        <Divider
          my="2"
          _light={{
            bg: 'muted.300',
          }}
          _dark={{
            bg: 'muted.50',
          }}
        />
        <Section title="Featured Events" mx="4" my={3} />

        <SectionListEvent />
      </Box>
    </ScrollView>
  );
}
