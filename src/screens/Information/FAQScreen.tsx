import React from 'react';
import {
  Box,
  Text,
  HStack,
  useTheme,
  ScrollView,
  ChevronRightIcon,
  Pressable,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import Header from '../../components/header/Header';
import AppContainer from '../../layout/AppContainer';

export default function FAQScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {colors} = useTheme();
  // const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menus: {
    name: string;
    route: keyof RootStackParamList;
    params?: any;
  }[] = [
    {
      name: 'Program',
      route: 'WebView',
      params: {customUrl: 'https://borobudurmarathon.com/id/tanya-jawab/'},
    },
    {
      name: 'Hari & Lomba',
      route: 'WebView',
      params: {customUrl: 'https://borobudurmarathon.com/id/hari-lomba-2022/'},
    },
    {
      name: 'Elite Race',
      route: 'WebView',
      params: {customUrl: 'https://borobudurmarathon.com/id/elite-race/'},
    },
    {
      name: 'Tilik Candi',
      route: 'WebView',
      params: {
        customUrl:
          'https://borobudurmarathon.com/id/tanya-jawab-tilik-candi-2022/',
      },
    },
    {
      name: 'Young Talent',
      route: 'WebView',
      params: {
        customUrl:
          'https://borobudurmarathon.com/id/tanya-jawab-bank-jateng-young-talent-2022/',
      },
    },
    {
      name: 'Akomodasi',
      route: 'WebView',
      params: {
        customUrl: 'https://borobudurmarathon.com/id/akomodasi/',
      },
    },
    {
      name: 'Transportasi',
      route: 'WebView',
      params: {
        customUrl: 'https://borobudurmarathon.com/id/transportasi/',
      },
    },
    {
      name: 'Panduan Kota Magelang',
      route: 'WebView',
      params: {
        customUrl: 'https://borobudurmarathon.com/id/panduan-kota/',
      },
    },
  ];

  return (
    <AppContainer>
      <ScrollView backgroundColor={colors.white}>
        <Header title="FAQs" left="back" />
        <Box borderTopColor={colors.gray[500]}>
          {menus.map((menu, index) => (
            <Pressable
              key={index}
              onPress={() => {
                if (menu.route) {
                  navigation.navigate(menu.route, menu.params);
                }
              }}>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                paddingX="3"
                paddingY="4"
                borderTopColor={colors.gray[300]}
                borderTopWidth={0.5}
                borderBottomColor={
                  index === menus.length - 1 ? colors.gray[300] : undefined
                }
                borderBottomWidth={
                  index === menus.length - 1 ? 0.5 : undefined
                }>
                <HStack alignItems="center">
                  <Text marginLeft="1">{menu.name}</Text>
                </HStack>
                <ChevronRightIcon />
              </HStack>
            </Pressable>
          ))}
        </Box>
      </ScrollView>
    </AppContainer>
  );
}
