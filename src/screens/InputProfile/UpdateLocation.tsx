import {useNavigation} from '@react-navigation/native';
import {Box, HStack, ScrollView, Text, Toast, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Heading} from '../../components/text/Heading';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {Alert, BackHandler, TouchableOpacity} from 'react-native';
import IconLocation from '../../assets/icons/IconLocation';
import {useAuthUser} from '../../context/auth.context';
import Button from '../../components/buttons/Button';
import {handleErrorMessage} from '../../helpers/apiErrors';
import {t} from 'i18next';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';
import {detectLocationFromGoogleAutocomplete} from '../../helpers/detectLocation';
import {ProfileService} from '../../api/profile.service';
import useInit from '../../hooks/useInit';
import LoadingBlock from '../../components/loading/LoadingBlock';
import TextInput from '../../components/form/TextInput';
import AlertMessage from '../../components/alert/AlertMessage';

export const truncate = (input: string) => {
  if (input.length > 6) {
    return input.substring(0, 6) + '..';
  }
  return input;
};

export default function UpdateLocationScreen() {
  const {user} = useAuthUser();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {getProfile} = useInit();

  const [mode, setMode] = useState<'WNA_GOOGLEAUTOCOMPLETE' | 'WNA_RESULT'>(
    'WNA_GOOGLEAUTOCOMPLETE',
  );
  const [formManualInput, setFormManualInput] = useState({
    country: false,
    province: false,
    city: false,
  });

  const [locationData, setLocationData] = useState<{
    mdupCountry: string;
    mdupProvinces: string;
    mdupCity: string;
    mdupAddress: string;
  }>({mdupCountry: '', mdupProvinces: '', mdupCity: '', mdupAddress: ''});

  const [isLoading, setIsLoading] = useState(false);

  const citizen =
    user?.linked.mbsdZmemId?.[0]?.mbsdNationality === 'Indonesian' ||
    Number(user?.linked.mbsdZmemId?.[0]?.mbsdIDNumberType) === 1
      ? 'WNI'
      : 'WNA';

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (user) {
      const mbsdCountry = user?.linked.mbsdZmemId?.[0]?.mbsdCountry || '';
      const mbsdProvinces = user?.linked.mbsdZmemId?.[0]?.mbsdProvinces || '';
      const mbsdCity = user?.linked.mbsdZmemId?.[0]?.mbsdCity || '';
      const mbsdAddress = user?.linked.mbsdZmemId?.[0]?.mbsdAddress || '';
      const mbsdRawAddress = user?.linked.mbsdZmemId?.[0]?.mbsdAddress || '';

      if (citizen === 'WNA') {
        // setLocationData({
        //   mdupCountry: mbsdCountry ? mbsdCountry : 'Other Country',
        //   mdupProvinces: mbsdProvinces,
        //   mdupCity: mbsdCity,
        //   mdupAddress: mbsdAddress || mbsdRawAddress,
        // });
      } else {
        setLocationData({
          mdupCountry: mbsdCountry || 'Indonesia',
          mdupProvinces: mbsdProvinces,
          mdupCity: mbsdCity,
          mdupAddress: mbsdAddress || mbsdRawAddress,
        });
      }
    }
  }, [user]);

  const handleUpdateLocation = async () => {
    setIsLoading(true);
    try {
      const res = await ProfileService.updateLocation(locationData);

      console.log(res, 'res update location');

      await getProfile();

      Toast.show({title: 'Update location success'});

      setIsLoading(false);
      navigation.goBack();
    } catch (error) {
      handleErrorMessage(error, t('error.failedToUpload'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabledButton = () => {
    return (
      !locationData.mdupCountry ||
      !locationData.mdupProvinces ||
      !locationData.mdupCity ||
      !locationData.mdupAddress
    );
  };

  return (
    <GestureHandlerRootView style={{backgroundColor: 'white', height: '100%'}}>
      <VStack px="4" flex="1">
        <VStack>
          <VStack space="1" mt={'20px'}>
            <Heading>{t('profile.updateLocation')}</Heading>
            <Text fontWeight={400} color="#768499" fontSize={11}>
              {t('profile.updateLocationDesc')}
            </Text>
          </VStack>
        </VStack>
        <ScrollView flex={1}>
          <VStack my="3" space="2">
            <Text>
              Your Citizen:{' '}
              <Text bold>
                {citizen === 'WNI'
                  ? t('auth.selectCitizenCard')
                  : t('auth.selectCitizenCardWna')}
              </Text>
            </Text>
          </VStack>
          <VStack my="3" space="2">
            {/* {citizen === 'WNA' && (
              <SelectInput
                items={countries.map(({en_short_name}) => ({
                  label: en_short_name,
                  value: en_short_name,
                }))}
                value={locationData.mdupCountry}
                placeholder={t('auth.placeholderCountry') || ''}
                label={t('profile.country') || ''}
                onValueChange={val =>
                  setLocationData(oldVal => ({
                    ...oldVal,
                    mdupCountry: val,
                  }))
                }
              />
            )} */}
            {citizen === 'WNI' ? (
              <Box
                p={'16px'}
                borderStyle={'solid'}
                borderWidth={1}
                borderRadius={3}
                borderColor={'#E8ECF3'}>
                <Box mb={'16px'} flexDirection={'row'} alignItems={'center'}>
                  <IconLocation />
                  <VStack marginLeft={'16px'}>
                    {locationData.mdupCity &&
                    locationData.mdupProvinces &&
                    locationData.mdupAddress ? (
                      <>
                        <Text
                          fontSize={'14px'}
                          fontWeight={600}
                          color={'#1E1E1E'}>
                          {locationData.mdupCity}
                        </Text>
                        <Text
                          fontSize={'10px'}
                          fontWeight={400}
                          color={'#768499'}>
                          {locationData.mdupAddress}
                        </Text>
                      </>
                    ) : (
                      <Text
                        fontSize={'14px'}
                        fontWeight={400}
                        color={'#768499;'}>
                        No Address Yet...
                      </Text>
                    )}
                  </VStack>
                </Box>
                <Button
                  onPress={() =>
                    navigation.navigate('SearchLocation', {
                      onSelect: val => {
                        setLocationData({
                          ...locationData,
                          mdupProvinces: val.mlocProvince,
                          mdupCity: val.mlocRegency,
                          mdupAddress: val.mlocName,
                        });
                      },
                    })
                  }>
                  {locationData.mdupCity &&
                  locationData.mdupProvinces &&
                  locationData.mdupAddress
                    ? 'Edit'
                    : t('auth.chooseAddress')}
                </Button>
              </Box>
            ) : (
              <>
                {mode === 'WNA_GOOGLEAUTOCOMPLETE' ? (
                  <>
                    <Text bold>Address</Text>
                    <GooglePlacesAutocomplete
                      placeholder={t('auth.placeholderAddress') || ''}
                      onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        // const city = details?.address_components.filter(
                        //   f =>
                        //     JSON.stringify(f.types) ===
                        //     JSON.stringify(['locality', 'political']),
                        // )[0].short_name;
                        // const state = details?.address_components.filter(
                        //   f =>
                        //     JSON.stringify(f.types) ===
                        //     JSON.stringify([
                        //       'administrative_area_level_1',
                        //       'political',
                        //     ]),
                        // )[0].short_name;
                        console.log(
                          'GooglePlacesAutocomplete data',
                          JSON.stringify(data),
                        );
                        console.log(
                          'GooglePlacesAutocomplete details?.address_components',
                          JSON.stringify(details?.address_components),
                        );
                        // const findDisplayCity =
                        //   details?.address_components.filter(
                        //     f =>
                        //       JSON.stringify(f.types) ===
                        //         JSON.stringify(['locality', 'political']) ||
                        //       JSON.stringify(f.types) ===
                        //         JSON.stringify([
                        //           'administrative_area_level_2',
                        //           'political',
                        //         ]) ||
                        //       JSON.stringify(f.types) ===
                        //         JSON.stringify(['postal_town']),
                        //   );

                        const {
                          country,
                          province,
                          description,
                          city: displayCity,
                        } = detectLocationFromGoogleAutocomplete(data, details);
                        // const displayState =
                        //   details?.address_components.filter(
                        //     f =>
                        //       JSON.stringify(f.types) ===
                        //       JSON.stringify([
                        //         'administrative_area_level_1',
                        //         'political',
                        //       ]),
                        //   )[0].long_name;
                        setLocationData(oldVal => ({
                          ...oldVal,
                          mdupAddress: description,
                          mdupRawAddress: description,
                          mdupCity: displayCity || '',
                          mdupCountry: country || '',
                          mdupProvinces: province || '',
                        }));
                        console.log(description);
                        console.log(displayCity);
                        setMode('WNA_RESULT');

                        setFormManualInput({
                          country: !country,
                          province: !province,
                          city: !displayCity,
                        });
                      }}
                      query={{
                        key: Config.MAPS_API_KEY,
                        language: 'en',
                      }}
                      fetchDetails
                      styles={{
                        textInput: {
                          height: 50,
                          color: '#5d5d5d',
                          fontSize: 16,
                          borderRadius: 6,
                          borderColor: '#C5CDDB',
                          borderWidth: 1,
                        },
                        predefinedPlacesDescription: {
                          color: '#1faadb',
                        },
                      }}
                      disableScroll={false}
                      textInputProps={{
                        onChangeText: val =>
                          setLocationData(oldVal => ({
                            ...oldVal,
                            mdupAddress: val,
                            mdupRawAddress: val,
                            mdupCity: oldVal.mdupCity ?? '',
                          })),
                      }}
                    />
                  </>
                ) : (
                  false
                )}

                {mode === 'WNA_RESULT' ? (
                  <>
                    <HStack justifyContent="space-between">
                      <Text bold>Selected Address</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setMode('WNA_GOOGLEAUTOCOMPLETE');
                          setLocationData({
                            mdupCountry: '',
                            mdupProvinces: '',
                            mdupCity: '',
                            mdupAddress: '',
                          });
                        }}>
                        <Text color="orange.500">Change</Text>
                      </TouchableOpacity>
                    </HStack>
                    <Text>
                      Country:{' '}
                      {locationData.mdupCountry ? (
                        <Text color="gray.500">{locationData.mdupCountry}</Text>
                      ) : (
                        <Text color="red.500" italic>
                          Not Set
                        </Text>
                      )}
                    </Text>
                    <Text>
                      Province:{' '}
                      {locationData.mdupProvinces ? (
                        <Text color="gray.500">
                          {locationData.mdupProvinces}
                        </Text>
                      ) : (
                        <Text color="red.500" italic>
                          Not Set
                        </Text>
                      )}
                    </Text>
                    <Text>
                      City:{' '}
                      {locationData.mdupCity ? (
                        <Text color="gray.500">{locationData.mdupCity}</Text>
                      ) : (
                        <Text color="red.500" italic>
                          Not Set
                        </Text>
                      )}
                    </Text>
                    <Text>
                      Address:{' '}
                      {locationData.mdupAddress ? (
                        <Text color="gray.500">{locationData.mdupAddress}</Text>
                      ) : (
                        <Text color="red.500" italic>
                          Not Set
                        </Text>
                      )}
                    </Text>

                    <Box h="10px" />

                    {formManualInput.country ||
                    formManualInput.province ||
                    formManualInput.city ? (
                      <AlertMessage message="Please input some data manually." />
                    ) : (
                      false
                    )}
                    {formManualInput.country && (
                      <TextInput
                        label={t('profile.country') || ''}
                        placeholder={t('auth.placeholderInputCountry') || ''}
                        onChangeText={val =>
                          setLocationData({
                            ...locationData,
                            mdupCountry: val,
                          })
                        }
                        value={locationData.mdupCountry}
                      />
                    )}
                    {formManualInput.province && (
                      <TextInput
                        label={t('profile.province') || ''}
                        placeholder={t('auth.placeholderInputProvince') || ''}
                        onChangeText={val =>
                          setLocationData({
                            ...locationData,
                            mdupProvinces: val,
                          })
                        }
                        value={locationData.mdupProvinces}
                      />
                    )}
                    {formManualInput.city && (
                      <TextInput
                        label={t('profile.city') || ''}
                        placeholder={t('auth.placeholderInputCity') || ''}
                        onChangeText={val =>
                          setLocationData({
                            ...locationData,
                            mdupCity: val,
                          })
                        }
                        value={locationData.mdupCity}
                      />
                    )}
                    {(formManualInput.country ||
                      formManualInput.province ||
                      formManualInput.city) && (
                      <TextInput
                        label={t('profile.address') || ''}
                        placeholder={t('auth.placeholderAddress') || ''}
                        onChangeText={val =>
                          setLocationData({
                            ...locationData,
                            mdupAddress: val,
                          })
                        }
                        value={locationData.mdupAddress}
                      />
                    )}
                  </>
                ) : (
                  false
                )}
              </>
            )}
          </VStack>
        </ScrollView>

        <HStack my={3} space={'10px'}>
          <Button
            flex={1}
            h="12"
            borderRadius={'8px'}
            onPress={handleUpdateLocation}
            isLoading={isLoading}
            disabled={isDisabledButton()}
            bg={isDisabledButton() ? 'gray.400' : undefined}>
            {t('save')}
          </Button>
        </HStack>
      </VStack>

      {isLoading && (
        <LoadingBlock
          style={{
            opacity: 0.7,
          }}
        />
      )}
    </GestureHandlerRootView>
  );
}
