import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  ArrowBackIcon,
  Box,
  Button,
  HStack,
  Image,
  ScrollView,
  Text,
  useToast,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
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
import countries from '../../helpers/countries';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseCitizen'>;

export default function ChooseCitizenScreen({route}: Props) {
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {step, setStep, citizen, setCitizen, nextStep, prevStep} =
    useProfileStepper();

  const [isLoading, setIsLoading] = useState(false);
  const [stepCount, setStepCount] = useState(1);
  const [profileStep, setProfileStep] = useState(1);
  const [idImage, setIdImage] = useState<ImageOrVideo>();
  const [visible, setVisible] = useState(false);
  const [birthDate, setBirthDate] = useState<Date>();
  const toast = useToast();

  useEffect(() => {
    setStep('choose-citizen');
    setStepCount(1);
    setProfileStep(1);
  }, [isFocused]);

  const stepProperties = [
    {
      title: 'Choose Citizen',
      subtitle: 'Choose your citizen according to identity',
    },
    {
      title: citizen === 'WNI' ? 'Upload KTP' : 'Upload Passport',
      subtitle:
        citizen === 'WNI'
          ? 'Upload your KTP and please make sure it is readable'
          : 'Upload your Passport and please make sure still readable',
    },
    {
      note: 'Step 1 of 3 to Complete Profile',
      title: 'Account',
      subtitle: 'Enter all information below to continue',
    },
    {
      note: 'Step 2 of 3 to Complete Profile',
      title: 'Personal Data',
      subtitle: 'Enter all information below to continue',
    },
    {
      note: 'Step 3 of 3 to Complete Profile',
      title: 'Address Information',
      subtitle: 'Enter all information below to continue',
    },
  ];

  return (
    <VStack px="4" flex="1">
      <VStack>
        <Breadcrumbs
          titles={['Citizen', 'Upload ID', 'Profile']}
          step={stepCount + 1}
        />
        <VStack space="1" mt={'12px'}>
          {stepCount === 3 && (
            <Text fontWeight={400} color="#9FACBF" fontSize={12}>
              {stepProperties[stepCount - 1 + profileStep - 1].note}
            </Text>
          )}
          <Heading>
            {stepProperties[stepCount - 1 + profileStep - 1]?.title}
          </Heading>
          <Text fontWeight={400} color="#768499" fontSize={11}>
            {stepProperties[stepCount - 1 + profileStep - 1].subtitle}
          </Text>
        </VStack>
      </VStack>
      <ScrollView flex={1}>
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
                borderWidth="2"
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
                borderWidth="2"
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
                  <Text>Tap to Upload</Text>
                </Box>
              )}
            </TouchableOpacity>
            <Text color="#768499" fontSize={10}>
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
                    description:
                      'ID Image is too big, maximum file size is 5 MB',
                  });
                }
              }}
            />
          </VStack>
        )}
        {step === 'profile' && (
          <>
            {stepCount === 3 && profileStep === 1 && (
              <VStack my="3" space="2">
                <TextInput placeholder="Enter your name" label="Name" />
                <TextInput
                  placeholder="Enter your phone number"
                  label="Phone number"
                  helperText="We will send verification code to this number for validation"
                />
              </VStack>
            )}
            {stepCount === 3 && profileStep === 2 && (
              <VStack my="3" space="2">
                {/* <SelectInput
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
                /> */}
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
                {citizen === 'WNA' && (
                  <>
                    <SelectInput
                      items={countries.map(({en_short_name}) => ({
                        label: en_short_name,
                        value: en_short_name,
                      }))}
                      placeholder="Choose gender"
                      label="Location"
                    />
                    <SelectInput
                      items={countries.map(({nationality}) => ({
                        label: nationality,
                        value: nationality,
                      }))}
                      placeholder="Choose gender"
                      label="Gender"
                    />
                  </>
                )}
              </VStack>
            )}
            {stepCount === 3 && profileStep === 3 && (
              <VStack my="3" space="2">
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
                  label="Location"
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
                <TextInput
                  placeholder="Enter your place of birth"
                  label="Place of birth"
                />
              </VStack>
            )}
          </>
        )}
      </ScrollView>
      <HStack my={3} space={'10px'}>
        {profileStep > 1 && (
          <Button
            h="12"
            backgroundColor={'#E7F3FC'}
            borderRadius={'8px'}
            onPress={() => {
              setProfileStep(v => (v > 1 ? v - 1 : v));
              // prevStep();
            }}
            isLoading={isLoading}>
            <ArrowBackIcon color={'#1E1E1E'} />
          </Button>
        )}
        <Button
          flex={1}
          h="12"
          borderRadius={'8px'}
          onPress={async () => {
            if (profileStep === 3) {
            } else {
              if (stepCount === 3) {
                setProfileStep(v => v + 1);
              } else {
                nextStep();
                setStepCount(v => v + 1);
              }
            }
          }}
          isLoading={isLoading}>
          {profileStep === 3 ? 'Confirm' : 'Next'}
        </Button>
      </HStack>
    </VStack>
  );
}
