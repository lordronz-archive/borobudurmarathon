/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {extendTheme, NativeBaseProvider} from 'native-base';
import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const newColorTheme = {
    brand: {
      900: '#8287af',
      800: '#7c83db',
      700: '#b3bef6',
    },
  };
  const theme = extendTheme({colors: newColorTheme});
  // 3. Pass the `theme` prop to the `NativeBaseProvider`

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <SafeAreaView style={{...backgroundStyle, flex: 1}}>
        <RootNavigator />
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default App;
