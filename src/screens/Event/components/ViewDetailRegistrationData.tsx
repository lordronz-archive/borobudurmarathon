import React from 'react';
import {Row, Box, Divider, SectionList, Text, HStack} from 'native-base';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import {useRoute} from '@react-navigation/native';
import AppContainer from '../../../layout/AppContainer';
import Header from '../../../components/header/Header';

type Props = {
  fields?: string[];
  withoutMarginBottom?: boolean;
};

export default function ViewDetailRegistrationData(props: Props) {
  const route = useRoute();
  const params =
    route.params as RootStackParamList['ViewDetailRegistrationData'];

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
      title: 'Formulir Pendaftaran',
      show: true,
      data: params.fields
        .map(item => ({
          label: item.evhfLabel,
          value: params.data[item.evhfName],
        }))
        .filter(item => item.value !== undefined && item.value !== null),
    },
  ];

  // if (props.fields && props.fields.length > 0) {
  //   sectionsDataProfile = sectionsDataProfile.map(item => {
  //     item = {
  //       ...item,
  //       data: item.data.map(itemData => {
  //         if (itemData.data) {
  //           itemData.data = itemData.data.map(itemDataData => {
  //             itemDataData.show = false;
  //             if (itemDataData.fields) {
  //               for (const field of itemDataData.fields) {
  //                 if (props.fields?.includes(field)) {
  //                   itemDataData.show = true;
  //                 }
  //               }
  //             } else {
  //               itemDataData.show = true;
  //             }
  //             return itemDataData;
  //           });
  //           itemData.data = itemData.data.filter(tmpData => tmpData.show);
  //           itemData.show = itemData.data.length > 0;
  //         } else {
  //           itemData.show = false;
  //           if (itemData.fields) {
  //             for (const field of itemData.fields) {
  //               if (props.fields?.includes(field)) {
  //                 itemData.show = true;
  //               }
  //             }
  //           } else {
  //             itemData.show = true;
  //           }
  //         }
  //         return itemData;
  //       }),
  //     };
  //     item.data = item.data.filter(tmpData => tmpData.show);
  //     item.show = item.data.length > 0;
  //     return item;
  //   });
  //   sectionsDataProfile = sectionsDataProfile.filter(item => item.show);
  // }
  console.info('sectionsDataProfile', JSON.stringify(sectionsDataProfile));

  return (
    <AppContainer>
      <Header title="Detail Data Pendaftaran" left="back" />
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
          </HStack>
        )}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <Divider mt={2} mb={2} />}
        keyExtractor={(item, index) => item.label + index}
        ListFooterComponent={
          props.withoutMarginBottom ? undefined : <Box height="50" />
        }
      />
    </AppContainer>
  );
}
