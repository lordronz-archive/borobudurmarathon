import {useNavigation} from '@react-navigation/native';
import {
  Box,
  Checkbox,
  Text,
  VStack,
  ScrollView,
  Toast,
  Center,
  Button,
  HStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import TextInput from '../../components/form/TextInput';
import SelectInput from '../../components/form/SelectInput';
import DateInput from '../../components/form/DateInput';
import countries from '../../helpers/countries';
import {AuthService} from '../../api/auth.service';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getErrorMessage} from '../../helpers/errorHandler';
import {TouchableOpacity} from 'react-native';
import {useAuthUser} from '../../context/auth.context';
import {MasterLocationResponse} from '../../types/profile.type';
import {ProfileService} from '../../api/profile.service';
import {cleanPhoneNumber, countryPhoneCodes} from '../../helpers/phoneNumber';
import {ID_NUMBER_TYPE_OPTIONS} from '../../assets/data/ktpPassport';
import {getGenderOptions} from '../../assets/data/gender';
import {BLOOD_OPTIONS} from '../../assets/data/blood';
import {useTranslation} from 'react-i18next';
import {handleErrorMessage} from '../../helpers/apiErrors';
import OtpWhatsapp from '../../components/modal/OtpWhatsapp';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CountryCodeInput from '../Profile/components/CountryCodeInput';

export default function InputProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {user} = useAuthUser();

  // const isFocused = useIsFocused();
  // const route = useRoute();
  // const params = route.params as RootStackParamList['InputProfile'];

  const [isLoading, setIsLoading] = useState(false);
  const [birthDate, setBirthDate] = useState<Date>();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [countryCode, setCountryCode] = useState<string>();
  const [mbsdIDNumberType, setIDNumberType] = useState<string>('1');
  const [mbsdIDNumber, setIDNumber] = useState<string>();
  const [mbsdGender, setGender] = useState<string>('1');
  const [mbsdBirthPlace, setBirthPlace] = useState<string>();
  const [mbsdBirthDate, setMbsdBirthDate] = useState<string>();
  const [mbsdBloodType, setBloodType] = useState<string>();
  const [mbsdNationality, setNationality] = useState<string>();
  const [mbsdCountry, setCountry] = useState<string>();
  const [mbsdAddress, setAddress] = useState<string>();
  const [mbsdCity, setCity] = useState<string>();
  const [mbsdProvinces, setProvinces] = useState<string>();
  const [openOtpWhatsapp, setOpenOtpWhatsapp] = useState(false);
  const [openCountryCodeSheet, setOpenCountryCodeSheet] = useState(false);

  const [locations, setLocations] = useState<MasterLocationResponse>();

  const [checkbox, setCheckbox] = useState<string[]>([]);

  useEffect(() => {
    navigation.replace('ChooseCitizen');
    (async () => {
      const {data: loc} = await ProfileService.getLocation();
      setLocations(loc);
    })();
  }, []);
  const cancelRef = React.useRef(null);

  const payload = {
    mbsdIDNumber,
    mbsdBirthDate,
    mbsdBirthPlace,
    mbsdGender,
    mbsdBloodType: Number(mbsdBloodType),
    mbsdNationality,
    mbsdCountry,
    mbsdCity,
    mbsdProvinces,
    mbsdAddress,
    mbsdRawAddress: '-',
    mbsdIDNumberType: Number(mbsdIDNumberType),
    mbsdFile: 0,
    mmedEducation: '-',
    mmedOccupation: '-',
    mmedIncome: '-',
  };

  const {t} = useTranslation();

  const setProfile = async () => {
    setIsLoading(true);
    let valid = true;
    if (!mbsdIDNumber) {
      valid = false;
    }
    if (!mbsdGender) {
      valid = false;
    }
    if (!mbsdBirthDate) {
      valid = false;
    }
    if (!mbsdBirthPlace) {
      valid = false;
    }
    if (!mbsdBloodType) {
      valid = false;
    }
    if (!mbsdNationality) {
      valid = false;
    }
    if (!mbsdCountry) {
      valid = false;
    }
    if (!mbsdCity) {
      valid = false;
    }
    if (!mbsdProvinces) {
      valid = false;
    }
    if (!mbsdAddress) {
      valid = false;
    }
    // if (!phoneNumber) {
    //   valid = false;
    // }

    if (!valid) {
      Toast.show({
        title: 'Not Completed',
        description: 'Please complete the required data.',
      });
      setIsLoading(false);
      return;
    }

    try {
      if (
        cleanPhoneNumber(user?.linked?.zmemAuusId?.[0]?.auusPhone) !==
        cleanPhoneNumber(phoneNumber)
      ) {
        const sendOtpRes = await AuthService.sendOTP({
          phoneNumber,
          countryCode: countryCode ? +countryCode : undefined,
        });
        console.info('SendOTP result: ', sendOtpRes);
        navigation.navigate('PhoneNumberValidation', {
          phoneNumber,
          onSuccess: () => {
            setProfileAfterVerifyPhoneSuccess();
          },
        });
      } else {
        setProfileAfterVerifyPhoneSuccess();
      }
    } catch (err) {
      handleErrorMessage(err, t('error.failedToSendOTP'));
    } finally {
      setIsLoading(false);
    }
  };

  const setProfileAfterVerifyPhoneSuccess = async () => {
    try {
      setIsLoading(true);
      const res = await AuthService.setprofile(payload);
      console.info('Setprofile result: ', res);

      navigation.navigate('Welcome');
      setIsLoading(false);
    } catch (err) {
      handleErrorMessage(err, t('error.failedToSaveProfile'));
      setIsLoading(false);
    }
  };
  if (!locations) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{backgroundColor: 'white', height: '100%'}}>
      <ScrollView>
        <VStack space="4" pb="3">
          <Box px="4">
            <BackHeader onPress={() => navigation.goBack()} />
            <VStack space="1.5">
              <Heading>{t('profile.completeProfile')}</Heading>
              <Text fontWeight={400} color="#768499" fontSize={11}>
                {t('profile.enterAllInfoToContinue')}
              </Text>
            </VStack>
          </Box>
          <VStack space="2.5" px="4">
            <Text
              fontWeight={600}
              color="#1E1E1E"
              fontSize={14}
              fontFamily="Poppins-Bold">
              {t('label.accountInformation')}
            </Text>
            <VStack space="1.5">
              <TextInput placeholder="Enter your name" label="Name" />
              <HStack space="1.5" width="100%">
                <SelectInput
                  label={t('countryCode') || ''}
                  placeholder="62"
                  items={countryPhoneCodes.map(v => ({
                    label: v.code,
                    value: v.code,
                  }))}
                  width={'30%'}
                  onValueChange={v => setCountryCode(v)}
                  value={countryCode}
                  useSheet
                  onPress={() => setOpenCountryCodeSheet(ss => !ss)}
                />
                <TextInput
                  placeholder={t('auth.placeholderPhone') || ''}
                  label={t('phoneNumber') || ''}
                  helperText={t('auth.willSendToPhone')}
                  onChangeText={setPhoneNumber}
                  value={phoneNumber}
                  width={'70%'}
                />
              </HStack>
            </VStack>
          </VStack>
          <VStack space="2.5" px="4">
            <Text
              fontWeight={600}
              color="#1E1E1E"
              fontSize={14}
              fontFamily="Poppins-Bold">
              {t('label.personalData')}
            </Text>
            <VStack space="1.5">
              <SelectInput
                items={ID_NUMBER_TYPE_OPTIONS}
                placeholder="Choose identity type"
                label="Identity Type"
                onValueChange={setIDNumberType}
                value={mbsdIDNumberType}
              />
              <TextInput
                placeholder="Enter your identity number"
                label="Identity number"
                helperText="Enter your KTP/SIM/Passport ID number"
                onChangeText={setIDNumber}
                value={mbsdIDNumber}
                keyboardType={'numeric'}
              />
              <SelectInput
                items={getGenderOptions(t('gender.male'), t('gender.female'))}
                placeholder={t('profile.chooseGender') || ''}
                label={t('profile.gender') || ''}
                onValueChange={setGender}
                value={mbsdGender}
                hideSearch
              />
              <DateInput
                placeholder="DD MMM YYYY"
                label={t('profile.dob') || ''}
                date={birthDate}
                setDate={date => {
                  setBirthDate(date);
                  setMbsdBirthDate(date.toJSON().slice(0, 10));
                }}
              />
              <TextInput
                placeholder={t('profile.enterPob') || ''}
                label={t('profile.pob') || ''}
                onChangeText={setBirthPlace}
                value={mbsdBirthPlace}
              />
              <SelectInput
                items={BLOOD_OPTIONS}
                placeholder={t('auth.placeholderBloodType') || ''}
                label={t('profile.bloodType') || ''}
                onValueChange={setBloodType}
                value={mbsdBloodType}
              />
              <SelectInput
                items={countries.map(({en_short_name}) => ({
                  label: en_short_name,
                  value: en_short_name,
                }))}
                placeholder={t('auth.placeholderCountry') || ''}
                label={t('profile.country') || ''}
                onValueChange={setCountry}
                value={mbsdCountry}
              />
              <SelectInput
                items={countries.map(({nationality}) => ({
                  label: nationality,
                  value: nationality,
                }))}
                placeholder={t('auth.placeholderNationality') || ''}
                label={t('profile.nationality') || ''}
                onValueChange={setNationality}
                value={mbsdNationality}
              />
            </VStack>
          </VStack>
          <VStack space="2.5" px="4">
            <Text
              fontWeight={600}
              color="#1E1E1E"
              fontSize={14}
              fontFamily="Poppins-Bold">
              {t('label.addressInformation')}
            </Text>
            <VStack space="1.5">
              <SelectInput
                items={locations?.data.map(v => ({
                  label: v.mlocProvince,
                  value: v.mlocProvince,
                }))}
                placeholder="Enter province name"
                label="Province"
                onValueChange={text => {
                  setProvinces(text);
                  (async () => {
                    const {data: loc} = await ProfileService.getLocation({
                      filter: {
                        mlocProvince: {like: `%${text}%`},
                      },
                    });
                    setLocations(loc);
                  })();
                }}
                value={mbsdProvinces}
              />
              <SelectInput
                items={locations?.data.map(v => ({
                  label: v.mlocRegency,
                  value: v.mlocRegency,
                }))}
                placeholder="Enter city or district name"
                label="City/District"
                onValueChange={text => {
                  setCity(text);
                  (async () => {
                    const {data: loc} = await ProfileService.getLocation({
                      filter: {
                        ...(mbsdProvinces && {
                          mlocProvince: {like: `%${mbsdProvinces}%`},
                        }),
                        mlocRegency: {like: `%${text}%`},
                      },
                    });
                    setLocations(loc);
                  })();
                }}
                value={mbsdCity}
              />
              <TextInput
                placeholder="Enter your address"
                label="Address"
                onChangeText={setAddress}
                value={mbsdAddress}
              />
            </VStack>
          </VStack>

          <TouchableOpacity
            style={{paddingHorizontal: 20, paddingVertical: 5}}
            onPress={() => {
              setBirthDate(new Date('1995-11-29'));
              setPhoneNumber('083116872224');
              setIDNumber('33181100000000');
              setBirthPlace('Pati');
              setMbsdBirthDate('1995-11-29');
              setBloodType('3');
              setNationality('Indonesian');
              setCountry('Indonesia');
              setAddress('Wuwur');
              setCity('Pati');
              setProvinces('Jawa Tengah');
            }}>
            <Center>
              <Text color="primary.900">Set Dummy Data</Text>
            </Center>
          </TouchableOpacity>

          <Box backgroundColor={'#F4F6F9'} px={4}>
            <Checkbox.Group
              onChange={setCheckbox}
              value={checkbox}
              accessibilityLabel="Agree to terms">
              <Checkbox
                value="agreed"
                _text={{fontSize: 12, px: 3}}
                isDisabled={isLoading}>
                {t('termsAndConditionsAgreement')}
              </Checkbox>
            </Checkbox.Group>
          </Box>
          <Box px="4">
            <Button
              h="12"
              onPress={() => {
                if (countryCode && countryCode !== '62') {
                  setOpenOtpWhatsapp(true);
                  return;
                }
                setProfile();
              }}
              isLoading={isLoading}
              isDisabled={checkbox[0] !== 'agreed'}>
              {t('continue')}
            </Button>
          </Box>
          <OtpWhatsapp
            cancelRef={cancelRef}
            isOpen={openOtpWhatsapp}
            onClose={setOpenOtpWhatsapp}
            onPress={() => {
              setOpenOtpWhatsapp(false);
              setProfile();
            }}
            title={'WhatsApp OTP'}
            content={t('auth.otpWhatsappDesc')}
            buttonContent={t('next')}
          />
        </VStack>
      </ScrollView>

      {openCountryCodeSheet && (
        <CountryCodeInput
          setCountryCode={s => setCountryCode(s.toString())}
          items={[]}
          open={openCountryCodeSheet}
          setOpen={setOpenCountryCodeSheet}
        />
      )}
    </GestureHandlerRootView>
  );
}
