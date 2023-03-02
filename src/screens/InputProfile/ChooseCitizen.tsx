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

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseCitizen'>;

export default function ChooseCitizenScreen({route}: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<number>();

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
          onPress={() => setSelected(0)}>
          <Box
            w="full"
            h="full"
            justifyContent="center"
            alignItems={'center'}
            borderColor={selected === 0 ? 'primary.900' : '#C5CDDB'}
            borderWidth="1"
            borderRadius="10px">
            <IconIndonesia />
            <Text>WNI (Indonesian Citizen)</Text>
          </Box>
        </TouchableOpacity>
        <TouchableOpacity
          style={{width: '100%', height: 200}}
          onPress={() => setSelected(1)}>
          <Box
            w="full"
            h="full"
            justifyContent="center"
            alignItems={'center'}
            borderColor={selected === 1 ? 'primary.900' : '#C5CDDB'}
            borderWidth="1"
            borderRadius="10px">
            <IconWNA />
            <Text>WNA (Foreign Citizen)</Text>
          </Box>
        </TouchableOpacity>
      </VStack>
      <Button h="12" mb="3" onPress={() => {}} isLoading={isLoading}>
        Next
      </Button>
    </VStack>
  );
}
