import {useNavigation} from '@react-navigation/native';
import {Box, Button, Text, Toast, useToast, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import BackHeader from '../../components/header/BackHeader';
import {Heading} from '../../components/text/Heading';
import {AuthService} from '../../api/auth.service';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {getErrorMessage} from '../../helpers/errorHandler';
import config from '../../config';
import {ProfileService} from '../../api/profile.service';
import Breadcrumbs from '../../components/header/Breadcrumbs';
import Header from '../../components/header/Header';
import {TouchableOpacity} from 'react-native';
import IconIndonesia from '../../assets/icons/IconIndonesia';
import IconWNA from '../../assets/icons/IconWNA';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseCitizen'>;

export default function ChooseCitizenScreen({route}: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<number>();

  const getProfile = () => {
    ProfileService.getMemberDetail()
      .then(resProfile => {
        console.info('resProfile', resProfile);
        console.info('###resProfile###', JSON.stringify(resProfile));
        if (resProfile.data && resProfile.data.length > 0) {
          if (resProfile.linked.zmemAuusId[0].auusConsent) {
            // profile has been completed
            // if (payload.data.linked.mbsdZmemId[0].mbsdStatus > 0) {
            //   state.readyToRegister = true;
            // }
            navigation.navigate('Welcome');
          } else if (!resProfile.linked.zmemAuusId[0].auusConsent) {
            navigation.navigate('DataConfirmation');
          }
        }
      })
      .catch(err => {
        console.info('### error resProfile', err);
        console.info('### error resProfile --- ', JSON.stringify(err));
        if (err && err.errorCode === 409) {
          navigation.navigate('Logout');
          // setIsNotRegistered(true);
        } else {
          toast.show({
            title: 'Failed to get profile',
            variant: 'subtle',
            description: getErrorMessage(err),
          });
          navigation.navigate('Initial');
        }
      });
  };

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
