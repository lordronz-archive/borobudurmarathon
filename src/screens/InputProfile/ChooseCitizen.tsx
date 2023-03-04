import {useNavigation} from '@react-navigation/native';
import {Box, Button, Image, Text, useToast, VStack} from 'native-base';
import React, {useState} from 'react';
import {Heading} from '../../components/text/Heading';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Breadcrumbs from '../../components/header/Breadcrumbs';
import {TouchableOpacity} from 'react-native';
import IconIndonesia from '../../assets/icons/IconIndonesia';
import IconWNA from '../../assets/icons/IconWNA';
import useProfileStepper from '../../hooks/useProfileStepper';
import ImagePicker from '../../components/modal/ImagePicker';
import IconUpload from '../../assets/icons/IconUpload';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import TextInput from '../../components/form/TextInput';
import SelectInput from '../../components/form/SelectInput';
import DateInput from '../../components/form/DateInput';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseCitizen'>;

export default function ChooseCitizenScreen({route}: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {step, citizen, setCitizen, nextStep, prevStep} = useProfileStepper();

  const [isLoading, setIsLoading] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [idImage, setIdImage] = useState<ImageOrVideo>();
  const [visible, setVisible] = useState(false);
  const [birthDate, setBirthDate] = useState<Date>();
  const toast = useToast();

  const stepProperties = [
    {
      title: 'Choose Citizen',
      subtitle: 'Choose your citizen according to identity',
    },
    {
      title: 'Upload KTP',
      subtitle: 'Upload your KTP and please make sure it is readable',
    },
    {
      title: 'Account',
      subtitle: 'Enter all information below to continue',
    },
    {
      title: 'Personal Data',
      subtitle: 'Enter all information below to continue',
    },
    {
      title: 'Address Information',
      subtitle: 'Enter all information below to continue',
    },
  ];

  return (
    <VStack px="4" flex="1">
      <Box>
        <Breadcrumbs
          titles={['Citizen', 'Upload ID', 'Profile']}
          step={stepCount + 1}
        />
        <VStack space="1.5">
          <Heading>{stepProperties[stepCount].title}</Heading>
          <Text fontWeight={400} color="#768499" fontSize={11}>
            {stepProperties[stepCount].subtitle}
          </Text>
        </VStack>
      </Box>
      {step === 'choose-citizen' && (
        <VStack my="3" space="2">
          <TouchableOpacity
            style={{width: '100%', height: 200}}
            onPress={() => setCitizen('WNI')}>
            <Box
              w="full"
              h="full"
              justifyContent="center"
              alignItems={'center'}
              borderColor={citizen === 'WNI' ? 'primary.900' : '#C5CDDB'}
              borderWidth="1"
              borderRadius="10px">
              <IconIndonesia />
              <Text>WNI (Indonesian Citizen)</Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity
            style={{width: '100%', height: 200}}
            onPress={() => setCitizen('WNA')}>
            <Box
              w="full"
              h="full"
              justifyContent="center"
              alignItems={'center'}
              borderColor={citizen === 'WNA' ? 'primary.900' : '#C5CDDB'}
              borderWidth="1"
              borderRadius="10px">
              <IconWNA />
              <Text>WNA (Foreign Citizen)</Text>
            </Box>
          </TouchableOpacity>
        </VStack>
      )}
      {step === 'upload-id' && (
        <VStack my="3" space="2">
          <TouchableOpacity
            style={{width: '100%', height: 200}}
            onPress={() => setVisible(true)}>
            {idImage ? (
              <Box
                p="1"
                justifyContent="center"
                alignItems={'center'}
                borderColor={'primary.900'}
                borderWidth="1"
                borderRadius="10px"
                borderStyle={'dashed'}>
                <Image
                  source={{uri: idImage.path}}
                  resizeMode={'cover'}
                  size={'full'}
                  alt="ID Image"
                />
              </Box>
            ) : (
              <Box
                w="full"
                h="full"
                justifyContent="center"
                alignItems={'center'}
                borderColor={'#C5CDDB'}
                borderWidth="1"
                borderRadius="10px"
                borderStyle={'dashed'}>
                <IconUpload />
                <Text>WNI (Indonesian Citizen)</Text>
              </Box>
            )}
          </TouchableOpacity>
          <Text color="#768499">
            Maximum file size is 5MB in .jpg format with clear images
          </Text>
          <ImagePicker
            setVisible={setVisible}
            visible={visible}
            onChange={image => {
              if (image.size <= 5 * 1e6) {
                setIdImage(image);
              } else {
                toast.show({
                  id: 'id-image-too-big',
                  description: 'ID Image is too big, maximum file size is 5 MB',
                });
              }
            }}
          />
        </VStack>
      )}
      {step === 'profile' && (
        <>
          {stepCount === 2 && (
            <VStack my="3" space="2">
              <TextInput placeholder="Enter your name" label="Name" />
              <TextInput
                placeholder="Enter your phone number"
                label="Phone number"
                helperText="We will send verification code to this number for validation"
              />
            </VStack>
          )}
          {stepCount === 3 && (
            <VStack my="3" space="2">
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
              />
              <TextInput
                placeholder="Enter your identity number"
                label="Identity number"
                helperText="Enter your KTP/SIM/Passport ID number"
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
              />
              <DateInput
                setDate={date => {
                  setBirthDate(date);
                  // setMbsdBirthDate(date.toJSON().slice(0, 10));
                }}
                placeholder="DD MMM YYYY"
                label="Date of birth"
              />
              <TextInput
                placeholder="Enter your place of birth"
                label="Place of birth"
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
              />
            </VStack>
          )}
          {stepCount === 4 && (
            <VStack my="3" space="2">
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
              />
              <TextInput
                placeholder="Enter your identity number"
                label="Identity number"
                helperText="Enter your KTP/SIM/Passport ID number"
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
              />
              <DateInput
                setDate={date => {
                  setBirthDate(date);
                  // setMbsdBirthDate(date.toJSON().slice(0, 10));
                }}
                placeholder="DD MMM YYYY"
                label="Date of birth"
              />
              <TextInput
                placeholder="Enter your place of birth"
                label="Place of birth"
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
              />
            </VStack>
          )}
        </>
      )}
      <Button
        h="12"
        mb="3"
        onPress={async () => {
          nextStep();
          setStepCount(v => v + 1);
        }}
        isLoading={isLoading}>
        Next
      </Button>
      <Button
        h="12"
        mb="3"
        onPress={() => {
          setStepCount(v => (v > 1 ? v - 1 : v));
          prevStep();
        }}
        isLoading={isLoading}>
        Back
      </Button>
    </VStack>
  );
}
