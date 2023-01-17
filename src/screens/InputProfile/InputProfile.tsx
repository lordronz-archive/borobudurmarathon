import {useNavigation} from '@react-navigation/native';
import {Box, Checkbox, Text, VStack, ScrollView} from 'native-base';
import React, {useState} from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import BMButton from '../../components/buttons/Button';
import TextInput from '../../components/form/TextInput';
import SelectInput from '../../components/form/SelectInput';
import DateInput from '../../components/form/DateInput';
import countries from '../../helpers/countries';
import {AuthService} from '../../api/auth.service';

export default function InputProfileScreen() {
  const navigation = useNavigation();

  const [birthDate, setBirthDate] = useState<Date>();
  const [mbsdIDNumber, setIDNumber] = useState<string>();
  const [mbsdBirthPlace, setBirthPlace] = useState<string>();
  const [mbsdBirthDate, setMbsdBirthDate] = useState<string>();
  const [mbsdBloodType, setBloodType] = useState<string>();
  const [mbsdNationality, setNationality] = useState<string>();
  const [mbsdCountry, setCountry] = useState<string>();
  const [mbsdAddress, setAddress] = useState<string>();
  const [mbsdCity, setCity] = useState<string>();
  const [mbsdProvinces, setProvinces] = useState<string>();

  const setProfile = async () => {
    const payload = {
      mbsdIDNumber,
      mbsdBirthDate,
      mbsdBirthPlace,
      mbsdBloodType,
      mbsdNationality,
      mbsdCountry,
      mbsdCity,
      mbsdProvinces,
      mbsdAddress,
      mbsdRawAddress: '-',
      mbsdIDNumberType: 0,
      mbsdFile: 0,
      mmedEducation: '-',
      mmedOccupation: '-',
      mmedIncome: '-',
    };
    let valid = true;
    if (!mbsdIDNumber) {
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

    if (!valid) {
      return;
    }
    console.info(payload);
    const res = await AuthService.setprofile(payload);
    console.info('Setprofile result: ', res);
  };

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
          <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
            Account Information
          </Text>
          <VStack space="1.5">
            <TextInput placeholder="Enter your name" label="Name" />
            <TextInput
              placeholder="Enter your phone number"
              label="Phone number"
              helperText="We will send verification code to this number for validation"
            />
          </VStack>
        </VStack>
        <VStack space="2.5" px="4">
          <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
            Personal Data
          </Text>
          <VStack space="1.5">
            <TextInput
              placeholder="Enter your identity number"
              label="Identity number"
              helperText="Enter your KTP/SIM/Passport ID number"
              onChangeText={setIDNumber}
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
            />
            <SelectInput
              items={countries.map(({en_short_name}) => ({
                label: en_short_name,
                value: en_short_name,
              }))}
              placeholder="Choose country"
              label="Country"
              onValueChange={setCountry}
            />
            <SelectInput
              items={countries.map(({nationality}) => ({
                label: nationality,
                value: nationality,
              }))}
              placeholder="Choose nationality"
              label="Nationality"
              onValueChange={setNationality}
            />
          </VStack>
        </VStack>
        <VStack space="2.5" px="4">
          <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
            Address Information
          </Text>
          <VStack space="1.5">
            <TextInput
              placeholder="Enter province name"
              label="Province"
              onChangeText={setProvinces}
            />
            <TextInput
              placeholder="Enter city or district name"
              label="City/District"
              onChangeText={setCity}
            />
            <TextInput
              placeholder="Enter your address"
              label="Address"
              onChangeText={setAddress}
            />
          </VStack>
        </VStack>
        <Box backgroundColor={'#F4F6F9'} py="3" px="4">
          <Checkbox value="agreed" _text={{fontSize: 12}}>
            Dengan melanjutkan saya mengerti, mengetahui, dan bersedia tunduk
            untuk segala persyaratan & ketentuan borobudur marathon.
          </Checkbox>
        </Box>
        <Box px="4">
          <BMButton h="12" onPress={setProfile}>
            Continue
          </BMButton>
        </Box>
      </VStack>
    </ScrollView>
  );
}
