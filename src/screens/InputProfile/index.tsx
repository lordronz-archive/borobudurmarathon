import {useNavigation} from '@react-navigation/native';
import {type NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Box, Text, VStack, Button} from 'native-base';
import React from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import BMButton from '../../components/buttons/Button';
import {RootStackParamList} from '../../navigation/RootNavigator';

export default function DataConfirmationScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <VStack px="4" flex="1">
      <Box flex="10">
        <BackHeader onPress={() => navigation.goBack()} />
        <VStack space="1.5">
          <Heading>Data Confirmation</Heading>
          <Text fontWeight={400} color="#768499" fontSize={11}>
            Choose whether you want to create new profile or use your existing
            profil information
          </Text>
        </VStack>
        <Box mt={21.4}>
          <Text fontWeight={400} color="#1E1E1E" fontSize={12}>
            Kami mendeteksi bahwa Anda sudah pernah mendaftar ke Aplikasi
            Borobudur Marathon. Apakah Anda ingin menggunakan data lama sebagai
            data profil?
          </Text>
        </Box>
      </Box>
      <Button.Group flex="1">
        <BMButton variant="outline" flex="1" h="12">
          No, Add New Profile
        </BMButton>
        <BMButton
          flex="1"
          h="12"
          onPress={() => navigation.navigate('InputProfile')}>
          Yes, Sure
        </BMButton>
      </Button.Group>
    </VStack>
  );
}
