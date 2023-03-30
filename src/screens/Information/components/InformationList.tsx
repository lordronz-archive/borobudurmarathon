import React from 'react';
import {
  Box,
  Text,
  HStack,
  ScrollView,
  ChevronRightIcon,
  Pressable,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/RootNavigator';
import i18next from 'i18next';

export type InformationListProps = {
  items: {
    name: {en: string; id: string};
    route: 'WebView';
    params: {
      url: {
        id: string;
        en: string;
      };
    };
  }[];
};

export default function InformationList(props: InformationListProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <ScrollView backgroundColor="white">
      <Box borderTopColor="gray.500">
        {props.items.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => {
              if (item.route) {
                navigation.navigate(item.route as any, {
                  ...item.params,
                  title: (item.name as any)[i18next.language],
                });
              }
            }}>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              paddingX="3"
              paddingY="4"
              borderTopColor="gray.300"
              borderTopWidth={0.5}
              borderBottomColor={
                index === props.items.length - 1 ? 'gray.300' : undefined
              }
              borderBottomWidth={
                index === props.items.length - 1 ? 0.5 : undefined
              }>
              <HStack alignItems="center">
                <Text marginLeft="1">
                  {(item.name as any)[i18next.language]}
                </Text>
              </HStack>
              <ChevronRightIcon />
            </HStack>
          </Pressable>
        ))}
      </Box>
    </ScrollView>
  );
}
