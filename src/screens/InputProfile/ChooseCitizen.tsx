import {useNavigation} from '@react-navigation/native';
import {Box, Button, Text, VStack} from 'native-base';
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

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseCitizen'>;

export default function ChooseCitizenScreen({route}: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {step, citizen, setCitizen, nextStep} = useProfileStepper();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <VStack px="4" flex="1">
      <Box>
        <Breadcrumbs titles={['Citizen', 'Upload ID', 'Profile']} step={1} />
        <VStack space="1.5">
          <Heading>Choose Citizen</Heading>
          <Text fontWeight={400} color="#768499" fontSize={11}>
            Choose your citizen according to identity
          </Text>
        </VStack>
      </Box>
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
      <Button
        h="12"
        mb="3"
        onPress={() => {
          nextStep();
        }}
        isLoading={isLoading}>
        Next
      </Button>
    </VStack>
  );
}
