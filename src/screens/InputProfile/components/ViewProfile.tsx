import React from 'react';
import {Row, Box, Divider, SectionList, Text} from 'native-base';
import {cleanPhoneNumber} from '../../../helpers/phoneNumber';
import {useAuthUser} from '../../../context/auth.context';
import moment from 'moment';
import {t} from 'i18next';
import {convertOption} from '../../../helpers/convertOption';

type Props = {
  fields?: string[];
  withoutMarginBottom?: boolean;
};

export default function ViewProfile(props: Props) {
  const {user} = useAuthUser();

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
      title: 'Account & Personal Data',
      data: [
        {
          fields: ['zmemFullName', 'evpaName'],
          label: 'Name',
          value: user?.data[0].zmemFullName,
        },
        {
          fields: ['mbsdEmail', 'evpaEmail'],
          label: 'Email',
          value: user?.linked.mbsdZmemId[0].mbsdEmail,
        },
        {
          fields: ['auusPhone', 'evpaPhone'],
          label: 'Phone Number',
          value: cleanPhoneNumber(user?.linked.zmemAuusId[0].auusPhone),
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
              value:
                user?.linked.mbsdZmemId[0].mbsdIDNumberType === 3
                  ? 'KTP'
                  : 'Passport',
            },
            {
              fields: ['mbsdIDNumber', 'evpaIDNumber'],
              label: 'ID Number',
              value: user?.linked.mbsdZmemId[0].mbsdIDNumber,
            },
          ],
        },
        {
          label: 'Birthday',
          data: [
            {
              fields: ['mbsdBirthPlace', 'evpaBirthPlace'],
              label: 'Place Of Birth',
              value: user?.linked.mbsdZmemId[0].mbsdBirthPlace,
            },
            {
              fields: ['mbsdBirthDate', 'evpaBirthDate'],
              label: 'Date of Birth',
              value: user?.linked.mbsdZmemId[0].mbsdBirthDate
                ? moment(user?.linked.mbsdZmemId[0].mbsdBirthDate).format(
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
              label: 'Gender',
              value: convertOption(
                user?.linked.mbsdZmemId[0].mbsdGender || '',
                'mbsdGender',
              ),
              // user?.linked.mbsdZmemId[0].mbsdGender === 1
              //   ? t('gender.male')
              //   : t('gender.female'),
            },
            {
              fields: ['mbsdBloodType', 'evpaBloodType'],
              label: 'Blood Type',
              value: convertOption(
                user?.linked.mbsdZmemId[0].mbsdBloodType || '',
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
              label: 'Country',
              value: user?.linked.mbsdZmemId[0].mbsdNationality,
            },
            {
              fields: ['mbsdCountry', 'evpaCountry'],
              label: 'Nationality',
              value: user?.linked.mbsdZmemId[0].mbsdCountry,
            },
          ],
        },
      ],
    },
    {
      title: t('label.addressInformation'),
      data: [
        user?.linked.mbsdZmemId[0].mbsdNationality === 'Indonesian'
          ? {
              label: 'Province City',
              data: [
                {
                  fields: ['mbsdProvinces', 'evpaProvinces', 'evpaProvinsi'],
                  label: 'Province',
                  value: user?.linked.mbsdZmemId[0].mbsdProvinces,
                },
                {
                  fields: ['mbsdCity', 'evpaCity'],
                  label: 'City',
                  value: user?.linked.mbsdZmemId[0].mbsdCity,
                },
              ],
            }
          : {label: '', value: ''},
        {
          fields: ['mbsdAddress', 'evpaAddress'],
          label: 'Address',
          value: user?.linked.mbsdZmemId[0].mbsdAddress,
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
  console.info('sectionsDataProfile', sectionsDataProfile);

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
        <Box mb="4" mt="5">
          <Text bold fontSize="lg">
            {title}
          </Text>
        </Box>
      )}
      ItemSeparatorComponent={() => <Divider mt={2} mb={2} />}
      keyExtractor={(item, index) => item.label + index}
      ListFooterComponent={
        props.withoutMarginBottom ? undefined : <Box height="50" />
      }
    />
  );
}
