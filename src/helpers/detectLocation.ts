import {
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import crashlytics from '@react-native-firebase/crashlytics';

export function detectLocationFromGoogleAutocomplete(
  data: GooglePlaceData,
  details: GooglePlaceDetail | null,
) {
  // const findDisplayCity = details?.address_components.filter(
  //   f =>
  //     JSON.stringify(f.types) === JSON.stringify(['locality', 'political']) ||
  //     JSON.stringify(f.types) ===
  //       JSON.stringify(['administrative_area_level_2', 'political']) ||
  //     JSON.stringify(f.types) === JSON.stringify(['postal_town']),
  // );
  const findCity = details?.address_components.find(
    item =>
      (item.types.includes('locality') && item.types.includes('political')) ||
      (item.types.includes('administrative_area_level_2') &&
        item.types.includes('political')) ||
      item.types.includes('postal_town'),
  );

  if (!findCity) {
    crashlytics().log(
      'city not found - DATA: ' + JSON.stringify({data, details}),
    );
    crashlytics().recordError({
      message: JSON.stringify({
        data: {data, details},
      }),
      name: 'city_not_found',
    });
  }

  return {
    description: data.description,
    city: findCity?.long_name || findCity?.short_name,
  };
}
