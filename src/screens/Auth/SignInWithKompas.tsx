import React, {useEffect, useState} from 'react';
import {Spinner} from 'native-base';
import {View} from 'react-native';
import WebView from 'react-native-webview';
import {AuthService} from '../../api/auth.service';

export default function SignInWithKompas() {
  const [uri, setUri] = useState<string>();

  useEffect(() => {
    AuthService.bindMemberToKompas().then(res => {
      setUri(res.url);
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      {uri ? <WebView source={{uri: uri || ''}} /> : <Spinner />}
    </View>
  );
}
