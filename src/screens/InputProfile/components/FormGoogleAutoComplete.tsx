import React, {useState} from 'react';
import {t} from 'i18next';
import {HStack, Box, Text} from 'native-base';
import {TouchableOpacity} from 'react-native';
import Config from 'react-native-config';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import AlertMessage from '../../../components/alert/AlertMessage';
import {detectLocationFromGoogleAutocomplete} from '../../../helpers/detectLocation';
import TextInput from '../../../components/form/TextInput';

type ILocationData = {
  mdupCountry: string;
  mdupProvinces: string;
  mdupCity: string;
  mdupAddress: string;
};

type Props = {
  initialValue?: ILocationData;
  onChange: (val: ILocationData) => void;

  hideLabel?: boolean;
};
export default function FormGoogleAutoComplete(props: Props) {
  const [mode, setMode] = useState<'WNA_GOOGLEAUTOCOMPLETE' | 'WNA_RESULT'>(
    'WNA_GOOGLEAUTOCOMPLETE',
  );
  const [formManualInput, setFormManualInput] = useState({
    country: false,
    province: false,
    city: false,
  });

  const [locationData, setLocationData] = useState<ILocationData>(
    props.initialValue || {
      mdupCountry: '',
      mdupProvinces: '',
      mdupCity: '',
      mdupAddress: '',
    },
  );

  const handleSetLocationData = (newValue: Partial<ILocationData>) => {
    const newData = {...locationData, ...newValue};
    setLocationData({...newData});
    props.onChange({...newData});
  };

  return (
    <>
      {mode === 'WNA_GOOGLEAUTOCOMPLETE' ? (
        <>
          {!props.hideLabel && <Text bold>{t('profile.address')}</Text>}
          <GooglePlacesAutocomplete
            placeholder={t('auth.placeholderAddress') || ''}
            listViewDisplayed={false}
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
              handleSetLocationData({
                mdupAddress: description,
                mdupCity: displayCity || '',
                mdupCountry: country || '',
                mdupProvinces: province || '',
              });
              console.log(description);
              console.log(displayCity);

              setFormManualInput({
                country: !country,
                province: !province,
                city: !displayCity,
              });

              setMode('WNA_RESULT');
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
            // textInputProps={{
            //   console.info('textInputProps');
            //   onChangeText: (val: any) =>
            //     handleSetLocationData({
            //       ...locationData,
            //       mdupAddress: val,
            //       mdupCity: locationData.mdupCity ?? '',
            //     }),
            // }}
          />
        </>
      ) : (
        false
      )}

      {mode === 'WNA_RESULT' ? (
        <>
          <HStack justifyContent="space-between">
            <Text bold>{t('profile.selectedAddress')}</Text>
            <TouchableOpacity
              onPress={() => {
                setMode('WNA_GOOGLEAUTOCOMPLETE');
                handleSetLocationData({
                  mdupCountry: '',
                  mdupProvinces: '',
                  mdupCity: '',
                  mdupAddress: '',
                });
              }}>
              <Text color="orange.500">{t('change')}</Text>
            </TouchableOpacity>
          </HStack>
          <Text>
            {t('profile.country')}:{' '}
            {locationData.mdupCountry ? (
              <Text color="gray.500">{locationData.mdupCountry}</Text>
            ) : (
              <Text color="red.500" italic>
                Not Set
              </Text>
            )}
          </Text>
          <Text>
            {t('profile.province')}:{' '}
            {locationData.mdupProvinces ? (
              <Text color="gray.500">{locationData.mdupProvinces}</Text>
            ) : (
              <Text color="red.500" italic>
                Not Set
              </Text>
            )}
          </Text>
          <Text>
            {t('profile.city')}:{' '}
            {locationData.mdupCity ? (
              <Text color="gray.500">{locationData.mdupCity}</Text>
            ) : (
              <Text color="red.500" italic>
                Not Set
              </Text>
            )}
          </Text>
          <Text>
            {t('profile.address')}:{' '}
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
            <AlertMessage message={t('message.inputDataManual')} />
          ) : (
            false
          )}
          {formManualInput.country && (
            <TextInput
              label={t('profile.country') || ''}
              placeholder={t('auth.placeholderInputCountry') || ''}
              onChangeText={val =>
                handleSetLocationData({
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
                handleSetLocationData({
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
                handleSetLocationData({
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
                handleSetLocationData({
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
  );
}
