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

  const [locations, setLocations] = useState<MasterLocationResponse>();

  const [checkbox, setCheckbox] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const {data: loc} = await ProfileService.getLocation();
      setLocations(loc);
    })();
  }, []);

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
      if ('0' + user?.linked?.mbspZmemId?.[0]?.mbspNumber !== phoneNumber) {
        const sendOtpRes = await AuthService.sendOTP({phoneNumber});
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
      Toast.show({
        title: 'Failed to send otp',
        description: 'Phone already used by another user',
      });
      console.info(err, getErrorMessage(err), 'Failed to send otp');
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
      Toast.show({
        title: 'Failed to save',
        description: getErrorMessage(err),
      });
      setIsLoading(false);
    }
  };
  if (!locations) {
    return null;
  }

  return (
    <ScrollView>
      <VStack space="4" pb="3">
        <Box px="4">
          <BackHeader onPress={() => navigation.goBack()} />
          <VStack space="1.5">
            <Heading>Complete Profile</Heading>
            <Text fontWeight={400} color="#768499" fontSize={11}>
              Enter all information below to continue
            </Text>
          </VStack>
        </Box>
        <VStack space="2.5" px="4">
          <Text
            fontWeight={600}
            color="#1E1E1E"
            fontSize={14}
            fontFamily="Poppins-Bold">
            Account Information
          </Text>
          <VStack space="1.5">
            <TextInput placeholder="Enter your name" label="Name" />
            <TextInput
              placeholder="Enter your phone number"
              label="Phone number"
              helperText="We will send verification code to this number for validation"
              onChangeText={setPhoneNumber}
              value={phoneNumber}
            />
          </VStack>
        </VStack>
        <VStack space="2.5" px="4">
          <Text
            fontWeight={600}
            color="#1E1E1E"
            fontSize={14}
            fontFamily="Poppins-Bold">
            Personal Data
          </Text>
          <VStack space="1.5">
            <SelectInput
              items={[
                {
                  label: 'KTP',
                  value: '1',
                },
                // {
                //   label: 'SIM',
                //   value: '2',
                // },
                // {
                //   label: 'Passport',
                //   value: '3',
                // },
              ]}
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
            />
            <SelectInput
              items={[
                {
                  label: 'Male',
                  value: '1',
                },
                {
                  label: 'Female',
                  value: '2',
                },
              ]}
              placeholder="Choose gender"
              label="Gender"
              onValueChange={setGender}
              value={mbsdGender}
              hideSearch
            />
            <DateInput
              placeholder="DD MMM YYYY"
              label="Date of birth"
              date={birthDate}
              setDate={date => {
                setBirthDate(date);
                setMbsdBirthDate(date.toJSON().slice(0, 10));
              }}
            />
            <TextInput
              placeholder="Enter your place of birth"
              label="Place of birth"
              onChangeText={setBirthPlace}
              value={mbsdBirthPlace}
            />
            <SelectInput
              items={[
                {
                  label: 'O',
                  value: '0',
                },
                {
                  label: 'O+',
                  value: '1',
                },
                {
                  label: 'O-',
                  value: '2',
                },
                {
                  label: 'A',
                  value: '3',
                },
                {
                  label: 'A+',
                  value: '4',
                },
                {
                  label: 'A-',
                  value: '5',
                },
                {
                  label: 'B',
                  value: '6',
                },
                {
                  label: 'B+',
                  value: '7',
                },
                {
                  label: 'B-',
                  value: '8',
                },
                {
                  label: 'AB',
                  value: '9',
                },
                {
                  label: 'AB+',
                  value: '10',
                },
                {
                  label: 'AB-',
                  value: '11',
                },
              ]}
              placeholder="Choose blood type"
              label="Blood Type"
              onValueChange={setBloodType}
              value={mbsdBloodType}
            />
            <SelectInput
              items={countries.map(({en_short_name}) => ({
                label: en_short_name,
                value: en_short_name,
              }))}
              placeholder="Choose country"
              label="Country"
              onValueChange={setCountry}
              value={mbsdCountry}
            />
            <SelectInput
              items={countries.map(({nationality}) => ({
                label: nationality,
                value: nationality,
              }))}
              placeholder="Choose nationality"
              label="Nationality"
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
            Address Information
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
              Dengan melanjutkan saya mengerti, mengetahui, dan bersedia tunduk
              tunduk untuk segala persyaratan & ketentuan borobudur marathon.
            </Checkbox>
          </Checkbox.Group>
        </Box>
        <Box px="4">
          <Button
            h="12"
            onPress={setProfile}
            isLoading={isLoading}
            isDisabled={checkbox[0] !== 'agreed'}>
            Continue
          </Button>
        </Box>
      </VStack>
    </ScrollView>
  );
}
