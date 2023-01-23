/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler';
import {extendTheme, NativeBaseProvider} from 'native-base';
import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {AuthUserProvider} from './src/context/auth.context';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const fontConfig = {
    Poppins: {
      100: {
        normal: 'Poppins-Light',
        italic: 'Poppins-LightItalic',
      },
      200: {
        normal: 'Poppins-Light',
        italic: 'Poppins-LightItalic',
      },
      300: {
        normal: 'Poppins-Light',
        italic: 'Poppins-LightItalic',
      },
      400: {
        normal: 'Poppins-Regular',
        italic: 'Poppins-Italic',
      },
      500: {
        normal: 'Poppins-Medium',
      },
      600: {
        normal: 'Poppins-Medium',
        italic: 'Poppins-MediumItalic',
      },
      700: {
        normal: 'Poppins-Bold',
      },
      800: {
        normal: 'Poppins-Bold',
        italic: 'Poppins-BoldItalic',
      },
      900: {
        normal: 'Poppins-Bold',
        italic: 'Poppins-BoldItalic',
      },
    },
  };

  const fonts = {
    heading: 'Poppins',
    body: 'Poppins',
    mono: 'Poppins',
  };

  const newColorTheme = {
    primary: {
      900: '#EB1C23',
      800: '#e91e63',
    },
    brand: {
      900: '#8287af',
      800: '#7c83db',
      700: '#b3bef6',
    },
  };
  const theme = extendTheme({
    colors: newColorTheme,
    fontConfig,
    fonts,
    components: {
      Button: {
        // Can simply pass default props to change default behaviour of components.
        defaultProps: {
          bgColor: '#EB1C23',
          size: 'lg',
        },
      },
      Text: {
        defaultProps: {
          fontFamily: 'Poppins',
        },
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <AuthUserProvider>
        <SafeAreaView style={{...backgroundStyle, flex: 1}}>
          <RootNavigator />
        </SafeAreaView>
      </AuthUserProvider>
    </NativeBaseProvider>
  );
};

export default App;
