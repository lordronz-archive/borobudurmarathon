import {useNavigation} from '@react-navigation/native';
import {
  Box,
  Checkbox,
  Text,
  VStack,
  ScrollView,
  AlertDialog,
  Center,
  Divider,
} from 'native-base';
import React, {useState} from 'react';
import BMButton from '../../components/buttons/Button';
import TextInput from '../../components/form/TextInput';
import SelectInput from '../../components/form/SelectInput';
import countries from '../../helpers/countries';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Header from '../../components/header/Header';
import IconCircleCheck from '../../assets/icons/IconCircleCheck';
import {EventService} from '../../api/event.service';

export default function RegisterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [isOpen, setIsOpen] = React.useState(false);

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);

  const [mbsdIDNumber, setIDNumber] = useState<string>();
  const [mbsdBirthPlace, setBirthPlace] = useState<string>();
  const [mbsdBloodType, setBloodType] = useState<string>();

  const [evpaEmergencyContactName, setEmergencyContactName] =
    useState<string>();
  const [evpaEmergencyContactNumber, setEmergencyContactNumber] =
    useState<string>();

  const [checkbox, setCheckbox] = useState<string[]>([]);

  const register = async () => {
    const payload = {
      evpaEmergencyContactName,
      evpaEmergencyContactNumber,
      mbsdIDNumber,
      mbsdBirthPlace,
      mbsdBloodType,
      mbsdRawAddress: '-',
      mbsdIDNumberType: 0,
      mbsdFile: 0,
      mmedEducation: '-',
      mmedOccupation: '-',
      mmedIncome: '-',
    };
    let valid = true;
    if (!evpaEmergencyContactName) {
      valid = false;
    }
    if (!evpaEmergencyContactNumber) {
      valid = false;
    }

    if (!valid) {
      return;
    }

    navigation.navigate('Main', {screen: 'My Events'});
  };

  React.useEffect(() => {
    (async () => {
      const res = await EventService.getEvent('4935');
      console.info(JSON.stringify(res));
      // console.info('get events: ', res);
    })();
  }, []);

  return (
    <ScrollView>
      <Header title="Form Registration" left="back" />
      <VStack space="4" pb="3">
        <Divider
          my="2"
          _light={{
            bg: 'muted.800',
          }}
          _dark={{
            bg: 'muted.50',
          }}
        />
        <VStack space="2.5" px="4">
          <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
            Registration Information
          </Text>
          <VStack space="1.5">
            <TextInput placeholder="Enter time" label="Estimated Time" />
            <TextInput
              placeholder="Enter name"
              label="Emergency Contact Name"
              onChangeText={setEmergencyContactName}
            />
            <TextInput
              placeholder="Enter phone number"
              label="Emergency Phone Number"
              onChangeText={setEmergencyContactNumber}
            />
            <SelectInput
              items={[
                {
                  label: 'XS',
                  value: 'XS',
                },
                {
                  label: 'S',
                  value: 'S',
                },
                {
                  label: 'M',
                  value: 'M',
                },
                {
                  label: 'L',
                  value: 'L',
                },
                {
                  label: 'XL',
                  value: 'XL',
                },
                {
                  label: '2XL',
                  value: '2XL',
                },
                {
                  label: '3XL',
                  value: '3XL',
                },
                {
                  label: '4XL',
                  value: '4XL',
                },
              ]}
              placeholder="Choose Jersey Size"
              label="Jersey Size Chart"
              onValueChange={setBloodType}
            />
          </VStack>
        </VStack>
        <VStack space="2.5" px="4">
          <Text fontWeight={600} color="#1E1E1E" fontSize={14}>
            Questionnaire
          </Text>
          <VStack space="1.5">
            <TextInput
              placeholder="Enter your identity number"
              label="Identity number"
              helperText="Enter your KTP/SIM/Passport ID number"
              onChangeText={setIDNumber}
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
        <Box backgroundColor={'#F4F6F9'} py="3" px="4">
          <Checkbox.Group
            onChange={setCheckbox}
            value={checkbox}
            accessibilityLabel="Agree to terms">
            <Checkbox value="agreed" _text={{fontSize: 12}}>
              Dengan melanjutkan saya mengerti, mengetahui, dan bersedia tunduk
              untuk segala persyaratan & ketentuan event borobudur marathon.
            </Checkbox>
          </Checkbox.Group>
        </Box>
        <Box px="4">
          <BMButton
            h="12"
            onPress={() => {
              // register();
              setIsOpen(true);
            }}>
            Register Now
          </BMButton>
        </Box>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.Body>
              <Center>
                <IconCircleCheck size={110} />
                <Center px="2" mb="4" mt="4">
                  <Text fontWeight={600} fontSize={16} mb="4">
                    Congratulation
                  </Text>
                  <Text fontWeight={400} color="#768499" fontSize={11}>
                    Registrasi event sukses. Silahkan lihat detail event untuk
                    melihat apakah Anda lolos tahap ballot
                  </Text>
                </Center>
                <BMButton
                  h="12"
                  width="full"
                  onPress={() => {
                    setIsOpen(false);
                  }}>
                  Check My Event
                </BMButton>
              </Center>
            </AlertDialog.Body>
          </AlertDialog.Content>
        </AlertDialog>
      </VStack>
    </ScrollView>
  );
}
