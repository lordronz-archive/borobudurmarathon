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

export default function InputProfileScreen() {
  const navigation = useNavigation();

  const [birthDate, setBirthDate] = useState<Date>();

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
            />
            <TextInput placeholder="DD MMM YYYY" label="Date of birth" />
            <TextInput
              placeholder="Enter your place of birth"
              label="Place of birth"
            />
            <DateInput
              placeholder="DD MMM YYYY"
              label="Date of birth"
              date={birthDate}
              setDate={setBirthDate}
            />
            <SelectInput
              items={[
                {
                  label: 'A',
                  value: 'A',
                },
                {
                  label: 'B',
                  value: 'B',
                },
                {
                  label: 'O',
                  value: 'O',
                },
                {
                  label: 'AB',
                  value: 'AB',
                },
              ]}
              placeholder="Choose blood type"
              label="Blood Type"
            />
            <SelectInput
              items={countries.map(({en_short_name}) => ({
                label: en_short_name,
                value: en_short_name,
              }))}
              placeholder="Choose country"
              label="Country"
            />
            <SelectInput
              items={countries.map(({nationality}) => ({
                label: nationality,
                value: nationality,
              }))}
              placeholder="Choose nationality"
              label="Nationality"
            />
          </VStack>
        </VStack>
        <VStack space="2.5" px="4">
          <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
            Address Information
          </Text>
          <VStack space="1.5">
            <TextInput placeholder="Enter province name" label="Province" />
            <TextInput
              placeholder="Enter city or district name"
              label="City/District"
            />
            <TextInput placeholder="Enter your address" label="Address" />
          </VStack>
        </VStack>
        <Box backgroundColor={'#F4F6F9'} py="3" px="4">
          <Checkbox value="agreed" _text={{fontSize: 12}}>
            Dengan melanjutkan saya mengerti, mengetahui, dan bersedia tunduk
            untuk segala persyaratan & ketentuan borobudur marathon.
          </Checkbox>
        </Box>
        <Box px="4">
          <BMButton h="12">Continue</BMButton>
        </Box>
      </VStack>
    </ScrollView>
  );
}
