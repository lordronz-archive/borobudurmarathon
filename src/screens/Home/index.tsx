import {Avatar, Box, Divider, Flex, Row, ScrollView, Text} from 'native-base';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont();

import {useAuthUser} from '../../context/auth.context';
import {getFullNameFromData, getShortCodeName} from '../../helpers/name';
import SectionListEvent from './components/SectionListEvent';
import SectionFeaturedEvents from './components/SectionFeaturedEvents';
import {TouchableOpacity} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/RootNavigator';
import IconInformationCircle from '../../assets/icons/IconInformationCircle';
import SummaryRecord from './components/SummaryRecord';
import IconHamburgerMenu from '../../assets/icons/IconHamburgerMenu';
import {useTranslation} from 'react-i18next';
import AppContainer from '../../layout/AppContainer';
// import useDeeplinkInit from '../../lib/deeplink/useDeeplinkInit';

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {user} = useAuthUser();
  const {t} = useTranslation();
  // const _resDLI = useDeeplinkInit();

  // useEffect(() => {
  //   if (isFocused) {
  //     checkLogin('Main');
  //   }
  // }, [isFocused]);

  return (
    <AppContainer>
      <ScrollView>
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
