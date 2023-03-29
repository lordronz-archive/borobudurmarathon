import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  HStack,
  Avatar,
  VStack,
  CheckCircleIcon,
  Spinner,
  Box,
  Image,
  Pressable,
  Text,
} from 'native-base';
import React, {useEffect} from 'react';
import config from '../../../config';
import {useAuthUser} from '../../../context/auth.context';
import {getShortCodeName, getFullNameFromData} from '../../../helpers/name';
import useInit from '../../../hooks/useInit';
import {RootStackParamList} from '../../../navigation/RootNavigator';

export default function SummaryProfile() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const {getProfile, isLoadingProfile} = useInit();
  const {user, isVerified} = useAuthUser();

  useEffect(() => {
    if (isFocused) {
      getProfile();
    }
  }, [isFocused]);

  return (
    <Pressable onPress={() => navigation.navigate('UpdateProfile')}>
      <HStack space={2} paddingLeft={3} paddingRight={3} alignItems="center">
        <Avatar
          bg="gray.400"
          mx={2}
          source={{
            uri:
              user &&
              user.data &&
              user.data.length > 0 &&
              user?.data[0]?.zmemPhoto
                ? `https://openpub.oss-ap-southeast-5.aliyuncs.com/${user?.data[0]?.zmemPhoto}`
                : undefined,
          }}>
          {getShortCodeName(getFullNameFromData(user))}
        </Avatar>
        <VStack paddingLeft={2}>
          <HStack alignItems="center" width="75%">
            <Text fontWeight="bold" fontSize="md" numberOfLines={1} mr="2">
              {getFullNameFromData(user)}
            </Text>
            {isVerified && <CheckCircleIcon color="blue.600" />}

            {isLoadingProfile && <Spinner size="sm" ml="1" />}
            {/* <Badge ml="2" colorScheme="success" variant="subtle">
                  <HStack alignItems="center">
                    <CheckIcon color="white" />
                    <Text color="white" fontSize="sm" ml="1">
                      verified
                    </Text>
                  </HStack>
                </Badge> */}
          </HStack>
          <Text color="gray.500" fontSize="sm">
            {user &&
            user.linked &&
            user?.linked.zmemAuusId.length > 0 &&
            user?.linked.zmemAuusId[0].auusEmail
              ? user?.linked.zmemAuusId[0].auusEmail
              : ''}
          </Text>
        </VStack>
      </HStack>
      {!config.isShowFeatureCertificate && (
        <Box marginX={0} marginTop={0} marginBottom={7} backgroundColor="white">
          <Image
            alt="hiasan"
            source={require('../../../assets/images/hiasan-color.png')}
            position="absolute"
            right={0}
            top={-90}
            zIndex={-1}
          />
          <Image
            alt="hiasan"
            source={require('../../../assets/images/hiasan-shadow.png')}
            position="absolute"
            right={0}
            top={-95}
            zIndex={-2}
          />
        </Box>
      )}
    </Pressable>
  );
}
