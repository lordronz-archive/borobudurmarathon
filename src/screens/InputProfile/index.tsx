import {useNavigation} from '@react-navigation/native';
import {type NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Box,
  Text,
  VStack,
  Button,
  Toast,
  Row,
  SectionList,
  Divider,
} from 'native-base';
import React from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import BMButton from '../../components/buttons/Button';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {AuthService} from '../../api/auth.service';
import {getErrorMessage} from '../../helpers/errorHandler';
import {useAuthUser} from '../../context/auth.context';
import I18n from '../../lib/i18n';

export default function DataConfirmationScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {user} = useAuthUser();

  const handleNoAddNewProfile = () => {
    AuthService.deleteprofile()
      .then(res => {
        console.info('res deleteProfile', res);
        navigation.navigate('InputProfile');
      })
      .catch(err => {
        Toast.show({
          title: 'Failed delete profile',
          description: getErrorMessage(err),
        });
      });
  };

  return (
    <VStack flex="1">
      <Box flex="10">
        <BackHeader onPress={() => navigation.goBack()} />
        <VStack space="1.5" px="4">
          <Heading>{I18n.t('consent.title')}</Heading>
          {/* <Text fontWeight={400} color="#768499" fontSize={11}>
            {I18n.t('consent.subtitle')}
          </Text> */}
          <Box>
            <Text fontWeight={400} color="#1E1E1E" fontSize={12}>
              {I18n.t('consent.description')}
            </Text>
          </Box>
        </VStack>

        <Box height="2" mt="5" mb="2" bgColor="gray.200" />
        <SectionList
          px="4"
          sections={[
            {
              title: 'Account & Personal Data',
              data: [
                {
                  label: 'Name',
                  value: user?.data[0].zmemFullName,
                },
                {
                  label: 'Phone Number',
                  value: user?.linked.mbsdZmemId[0].mbsdPhone,
                },
                {
                  label: 'Birthday',
                  data: [
                    {
                      label: 'Place Of Birth',
                      value: user?.linked.mbsdZmemId[0].mbsdBirthPlace,
                    },
                    {
                      label: 'Date of Birth',
                      value: user?.linked.mbsdZmemId[0].mbsdBirthDate,
                    },
                  ],
                },
                {
                  label: 'Gender Blood',
                  data: [
                    {
                      label: 'Gender',
                      value: user?.linked.mbsdZmemId[0].mbsdGender,
                    },
                    {
                      label: 'Blood Type',
                      value: user?.linked.mbsdZmemId[0].mbsdBloodType,
                    },
                  ],
                },
                {
                  label: 'Country Nationality',
                  data: [
                    {
                      label: 'Country',
                      value: user?.linked.mbsdZmemId[0].mbsdNationality,
                    },
                    {
                      label: 'Nationality',
                      value: user?.linked.mbsdZmemId[0].mbsdCountry,
                    },
                  ],
                },
              ],
            },
            {
              title: 'Address Info',
              data: [
                {
                  label: 'Province City',
                  data: [
                    {
                      label: 'Province',
                      value: user?.linked.mbsdZmemId[0].mbsdProvinces,
                    },
                    {
                      label: 'City',
                      value: user?.linked.mbsdZmemId[0].mbsdCity,
                    },
                  ],
                },
                {
                  label: 'Address',
                  value: user?.linked.mbsdZmemId[0].mbsdAddress,
                },
              ],
            },
          ]}
          renderItem={({item}) =>
            item.data && item.data.length > 0 ? (
              <Row flex={1}>
                {item.data.map(ditem => (
                  <Box key={ditem.label} flex={1}>
                    <Text color="gray.500" fontSize="sm">
                      {ditem.label}
                    </Text>
                    {ditem.value ? (
                      <Text>{ditem.value}</Text>
                    ) : (
                      <Text color="gray.500" italic>
                        ~ Not Set
                      </Text>
                    )}
                  </Box>
                ))}
              </Row>
            ) : (
              <Row>
                <Box>
                  <Text color="gray.500" fontSize="sm">
                    {item.label}
                  </Text>
                  {item.value ? (
                    <Text>{item.value}</Text>
                  ) : (
                    <Text color="gray.500" italic>
                      ~ Not Set
                    </Text>
                  )}
                </Box>
              </Row>
            )
          }
          renderSectionHeader={({section: {title}}) => (
            <Box mb="4" mt="5">
              <Text bold fontSize="lg">
                {title}
              </Text>
            </Box>
          )}
          ItemSeparatorComponent={() => <Divider mt={2} mb={2} />}
          keyExtractor={(item, index) => item.label + index}
        />
      </Box>
      <Button.Group flex="1">
        <BMButton
          variant="outline"
          flex="1"
          h="12"
          onPress={handleNoAddNewProfile}>
          No, Add New Profile
        </BMButton>
        <BMButton
          flex="1"
          h="12"
          onPress={() => navigation.navigate('InputProfile')}>
          Yes, Sure
        </BMButton>
      </Button.Group>
    </VStack>
  );
}
