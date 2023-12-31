import React, {useEffect} from 'react';
import {
  Row,
  Box,
  Divider,
  SectionList,
  Text,
  HStack,
  WarningOutlineIcon,
  Alert,
  Spinner,
} from 'native-base';
import {cleanPhoneNumber} from '../../../helpers/phoneNumber';
import {useAuthUser} from '../../../context/auth.context';
import moment from 'moment';
import {t} from 'i18next';
import {convertOption} from '../../../helpers/convertOption';
import {showIDNumberTypeName} from '../../../assets/data/ktpPassport';
import useInit from '../../../hooks/useInit';
import {getFullNameFromData} from '../../../helpers/name';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/RootNavigator';

type Props = {
  fields?: string[];
  withoutMarginBottom?: boolean;
  fetchProfile?: boolean;
};

export default function ViewProfile(props: Props = {fetchProfile: true}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {user, isVerified} = useAuthUser();
  const {getProfile, isLoadingProfile} = useInit();

  useEffect(() => {
    props.fetchProfile && getProfile();
  }, []);

  useEffect(() => {
    if (user) {
      const mbsdCountry = user?.linked.mbsdZmemId?.[0]?.mbsdCountry || '';
      const mbsdProvinces = user?.linked.mbsdZmemId?.[0]?.mbsdProvinces || '';
      const mbsdCity = user?.linked.mbsdZmemId?.[0]?.mbsdCity || '';
      const mbsdAddress = user?.linked.mbsdZmemId?.[0]?.mbsdAddress || '';

      if (
        !mbsdCountry ||
        !mbsdProvinces ||
        !mbsdCity ||
        !mbsdAddress
      ) {
        navigation.navigate('UpdateLocation');
      }
    }
  }, [user]);

  let sectionsDataProfile: {
    title: string;
    show?: boolean;
    data: {
      fields?: string[];
      label: string;
      value?: string | number | undefined | null;
      show?: boolean;
      data?: {
        fields?: string[];
        label: string;
        value: string | number | undefined | null;
        show?: boolean;
      }[];
    }[];
  }[] = [
    {
      title: t('label.accountInformation'),
      data: [
        {
          fields: ['zmemFullName', 'evpaName'],
          label: t('name'),
          value: getFullNameFromData(user),
        },
        {
          fields: ['mbsdEmail', 'evpaEmail'],
          label: 'Email',
          value:
            user &&
            user.linked &&
            user?.linked?.zmemAuusId.length > 0 &&
            user?.linked?.zmemAuusId[0]?.auusEmail
              ? user?.linked?.zmemAuusId[0]?.auusEmail
              : '',
        },
        {
          fields: ['auusPhone', 'evpaPhone'],
          label: t('phoneNumber'),
          value: cleanPhoneNumber(
            user?.linked &&
              user?.linked?.zmemAuusId &&
              user?.linked?.zmemAuusId.length > 0
              ? user?.linked?.zmemAuusId[0]?.auusPhone
              : '',
          ),
        },
      ],
    },
    {
      title: t('label.personalData'),
      data: [
        {
          label: 'Identity',
          data: [
            {
              fields: ['mbsdIDNumberType', 'evpaIDNumberType'],
              label: 'Type',
              value: showIDNumberTypeName(
                String(user?.linked?.mbsdZmemId?.[0]?.mbsdIDNumberType),
              ),
            },
            {
              fields: ['mbsdIDNumber', 'evpaIDNumber'],
              label: 'ID Number',
              value: user?.linked?.mbsdZmemId?.[0]?.mbsdIDNumber,
            },
          ],
        },
        {
          label: t('profile.birthday'),
          data: [
            {
              fields: ['mbsdBirthPlace', 'evpaBirthPlace'],
              label: t('profile.pob'),
              value: user?.linked?.mbsdZmemId?.[0]?.mbsdBirthPlace,
            },
            {
              fields: ['mbsdBirthDate', 'evpaBirthDate'],
              label: t('profile.dob'),
              value: user?.linked?.mbsdZmemId?.[0]?.mbsdBirthDate
                ? moment(user?.linked?.mbsdZmemId?.[0]?.mbsdBirthDate).format(
                    'DD MMMM yyyy',
                  )
                : undefined,
            },
          ],
        },
        {
          label: 'Gender Blood',
          data: [
            {
              fields: ['mbsdGender', 'evpaGender'],
              label: t('profile.gender'),
              value: convertOption(
                user?.linked?.mbsdZmemId?.[0]?.mbsdGender || '',
                'mbsdGender',
              ),
              // user?.linked?.mbsdZmemId?.[0]?.mbsdGender === 1
              //   ? t('gender.male')
              //   : t('gender.female'),
            },
            {
              fields: ['mbsdBloodType', 'evpaBloodType'],
              label: t('profile.bloodType'),
              // value: user?.linked?.mbsdZmemId?.[0]?.mbsdBloodType || 0,
              value: convertOption(
                user?.linked?.mbsdZmemId?.[0]?.mbsdBloodType || 0,
                'mbsdBloodType',
              ),
            },
          ],
        },
        {
          label: 'Country Nationality',
          data: [
            {
              fields: ['mbsdNationality', 'evpaNationality'],
              label: t('profile.nationality'),
              value: user?.linked?.mbsdZmemId?.[0]?.mbsdNationality,
            },
            {
              fields: ['mbsdCountry', 'evpaCountry'],
              label: t('profile.country'),
              value: user?.linked?.mbsdZmemId?.[0]?.mbsdCountry,
            },
          ],
        },
      ],
    },
    {
      title: t('label.addressInformation'),
      data: [
        user?.linked?.mbsdZmemId?.[0]?.mbsdNationality === 'Indonesian'
          ? {
              label: 'Province City',
              data: [
                {
                  fields: ['mbsdProvinces', 'evpaProvinces', 'evpaProvinsi'],
                  label: t('profile.province'),
                  value: user?.linked?.mbsdZmemId?.[0]?.mbsdProvinces,
                },
                {
                  fields: ['mbsdCity', 'evpaCity'],
                  label: t('profile.city'),
                  value: user?.linked?.mbsdZmemId?.[0]?.mbsdCity,
                },
              ],
            }
          : {label: '', value: ''},
        {
          fields: ['mbsdAddress', 'evpaAddress'],
          label: t('profile.address'),
          value: user?.linked?.mbsdZmemId?.[0]?.mbsdAddress,
        },
      ].filter(item => item && item.label),
    },
  ];

  if (props.fields && props.fields.length > 0) {
    sectionsDataProfile = sectionsDataProfile.map(item => {
      item = {
        ...item,
        data: item.data.map(itemData => {
          if (itemData.data) {
            itemData.data = itemData.data.map(itemDataData => {
              itemDataData.show = false;
              if (itemDataData.fields) {
                for (const field of itemDataData.fields) {
                  if (props.fields?.includes(field)) {
                    itemDataData.show = true;
                  }
                }
              } else {
                itemDataData.show = true;
              }
              return itemDataData;
            });
            itemData.data = itemData.data.filter(tmpData => tmpData.show);
            itemData.show = itemData.data.length > 0;
          } else {
            itemData.show = false;
            if (itemData.fields) {
              for (const field of itemData.fields) {
                if (props.fields?.includes(field)) {
                  itemData.show = true;
                }
              }
            } else {
              itemData.show = true;
            }
          }
          return itemData;
        }),
      };
      item.data = item.data.filter(tmpData => tmpData.show);
      item.show = item.data.length > 0;
      return item;
    });
    sectionsDataProfile = sectionsDataProfile.filter(item => item.show);
  }
  console.info('sectionsDataProfile', JSON.stringify(sectionsDataProfile));

  return (
    <SectionList
      px="4"
      sections={sectionsDataProfile}
      renderItem={({item}) =>
        item.data && item.data.length > 0 ? (
          <Row flex={1}>
            {item.data.map(ditem => (
              <Box key={ditem.label} flex={1}>
                <Text color="gray.500" fontSize="sm">
                  {ditem.label}
                </Text>
                {ditem.value ? (
                  <Text>{ditem.value}</Text>
                ) : (
                  <Text color="gray.500" italic>
                    ~ Not Set
                  </Text>
                )}
              </Box>
            ))}
          </Row>
        ) : (
          <Row>
            <Box>
              <Text color="gray.500" fontSize="sm">
                {item.label}
              </Text>
              {item.value ? (
                <Text>{item.value}</Text>
              ) : (
                <Text color="gray.500" italic>
                  ~ Not Set
                </Text>
              )}
            </Box>
          </Row>
        )
      }
      renderSectionHeader={({section: {title}}) => (
        <HStack mb="4" mt="5">
          <Text bold fontSize="lg">
            {title}
          </Text>
          {isLoadingProfile && <Spinner size="sm" ml="1" />}
        </HStack>
      )}
      ItemSeparatorComponent={() => <Divider mt={2} mb={2} />}
      keyExtractor={(item, index) => item.label + index}
      ListFooterComponent={
        props.withoutMarginBottom ? undefined : <Box height="50" />
      }
      ListHeaderComponent={
        isVerified ? undefined : (
          <Alert bgColor="warning.300">
            <HStack alignItems="center">
              <WarningOutlineIcon color="black" />
              <Text ml="1" fontSize="xs">
                {t('profile.alertNotVerifiedMessage')}
              </Text>
            </HStack>
          </Alert>
        )
      }
    />
  );
}
