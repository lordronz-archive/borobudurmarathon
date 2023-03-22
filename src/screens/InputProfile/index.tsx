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
  useToast,
  HStack,
} from 'native-base';
import React, {useState} from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import BMButton from '../../components/buttons/Button';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {AuthService} from '../../api/auth.service';
import {getErrorMessage} from '../../helpers/errorHandler';
import {useAuthUser} from '../../context/auth.context';
import moment from 'moment';
import {ProfileService} from '../../api/profile.service';
import {useDemo} from '../../context/demo.context';
import {useTranslation} from 'react-i18next';
import {cleanPhoneNumber} from '../../helpers/phoneNumber';
import ViewProfile from './components/ViewProfile';
import AppContainer from '../../layout/AppContainer';

export default function DataConfirmationScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {user} = useAuthUser();
  const {t} = useTranslation();
  const toast = useToast();
  const {setDemoConsent} = useDemo();
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // const sectionsDataProfile = [
  //   {
  //     title: 'Account & Personal Data',
  //     data: [
  //       {
  //         label: 'Name',
  //         value: user?.data[0].zmemFullName,
  //       },
  //       {
  //         label: 'Phone Number',
  //         value: cleanPhoneNumber(user?.linked.zmemAuusId[0].auusPhone),
  //       },
  //       {
  //         label: 'Birthday',
  //         data: [
  //           {
  //             label: 'Place Of Birth',
  //             value: user?.linked.mbsdZmemId[0].mbsdBirthPlace,
  //           },
  //           {
  //             label: 'Date of Birth',
  //             value: user?.linked.mbsdZmemId[0].mbsdBirthDate
  //               ? moment(user?.linked.mbsdZmemId[0].mbsdBirthDate).format(
  //                   'DD MMMM yyyy',
  //                 )
  //               : undefined,
  //           },
  //         ],
  //       },
  //       {
  //         label: 'Gender Blood',
  //         data: [
  //           {
  //             label: 'Gender',
  //             value:
  //               user?.linked.mbsdZmemId[0].mbsdGender === 1
  //                 ? t('gender.male')
  //                 : t('gender.female'),
  //           },
  //           {
  //             label: 'Blood Type',
  //             value: user?.linked.mbsdZmemId[0].mbsdBloodType,
  //           },
  //         ],
  //       },
  //       {
  //         label: 'Country Nationality',
  //         data: [
  //           {
  //             label: 'Country',
  //             value: user?.linked.mbsdZmemId[0].mbsdNationality,
  //           },
  //           {
  //             label: 'Nationality',
  //             value: user?.linked.mbsdZmemId[0].mbsdCountry,
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     title: 'Address Info',
  //     data: [
  //       user?.linked.mbsdZmemId[0].mbsdNationality === 'Indonesian'
  //         ? {
  //             label: 'Province City',
  //             data: [
  //               {
  //                 label: 'Province',
  //                 value: user?.linked.mbsdZmemId[0].mbsdProvinces,
  //               },
  //               {
  //                 label: 'City',
  //                 value: user?.linked.mbsdZmemId[0].mbsdCity,
  //               },
  //             ],
  //           }
  //         : {label: '', value: ''},
  //       {
  //         label: 'Address',
  //         value: user?.linked.mbsdZmemId[0].mbsdAddress,
  //       },
  //     ].filter(item => item && item.label),
  //   },
  // ];

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

  const handleUseExisting = () => {
    setIsLoadingAction(true);
    // check is profile complete?
    // perlu dicek apa saja yang wajib ada? jika semua sudah lengkap, baru mark as agree

    const isProfileComplete = true;
    if (isProfileComplete) {
      ProfileService.markAsAgreeTheConsent()
        .then(() => {
          setDemoConsent(false);
          navigation.navigate('Welcome');
          setIsLoadingAction(false);
        })
        .catch(err => {
          toast.show({
            title: 'Failed',
            description: getErrorMessage(err),
          });
          setIsLoadingAction(false);
        });
    } else {
      //
    }
  };

  return (
    <AppContainer>
      <VStack flex="1">
        <Box flex="10">
          <Box px="4">
            <BackHeader onPress={() => navigation.goBack()} />
            <VStack space="1.5">
              <Heading>{t('consent.title')}</Heading>
              {/* <Text fontWeight={400} color="#768499" fontSize={11}>
            {t('consent.subtitle')}
          </Text> */}
              <Box>
                <Text fontWeight={400} color="#1E1E1E" fontSize={12}>
                  {t('consent.description')}
                </Text>
              </Box>
            </VStack>
          </Box>

          <Box height="2" mt="5" mb="2" bgColor="gray.200" />
          <ViewProfile />
        </Box>
        <HStack my={3} px="4">
          <BMButton
            variant="outline"
            onPress={handleNoAddNewProfile}
            isLoading={isLoadingAction}>
            No, Add New Profile
          </BMButton>
          <BMButton onPress={handleUseExisting} isLoading={isLoadingAction}>
            Yes, Sure
          </BMButton>
        </HStack>
      </VStack>
    </AppContainer>
  );
}
