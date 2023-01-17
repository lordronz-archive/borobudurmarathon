import React from 'react';
import {View} from 'react-native';
import WebView from 'react-native-webview';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {Box, IconButton, ArrowBackIcon, useTheme} from 'native-base';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const urls: any = {
  // faq: 'https://borobudurmarathon.com',
  faq: 'https://borobudurmarathon.com/id/tanya-jawab/',
  about: 'https://google.com',
  tnc: 'https://borobudurmarathon.com/id/ketentuan-myborobudur/',
  default: 'https://google.com',
};
export default function WebViewScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as RootStackParamList['WebView'];
  const url = params.customUrl
    ? params.customUrl
    : urls[params?.page || 'default'];
  const {colors} = useTheme();

  return (
    <View style={{flex: 1}}>
      <Box alignItems="flex-start" padding={1} position="absolute" zIndex={10}>
        <IconButton
          onPress={() => navigation.goBack()}
          icon={<ArrowBackIcon />}
          borderRadius="full"
          backgroundColor={colors.gray[900] + ':alpha.20'}
          _icon={{
            color: colors.black,
            size: 'md',
          }}
          _hover={{
            bg: colors.primary[900] + ':alpha.20',
          }}
          _pressed={{
            bg: colors.primary[900] + ':alpha.20',
            _icon: {
              name: 'emoji-flirt',
            },
          }}
        />
      </Box>
      <WebView source={{uri: url}} />
    </View>
  );
}
