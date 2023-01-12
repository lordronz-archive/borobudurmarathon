import React, {useEffect, useState} from 'react';
import {Spinner} from 'native-base';
import {View} from 'react-native';
import WebView from 'react-native-webview';
import {AuthService} from '../../api/auth.service';

const injectScript = `
  (function () {
    window.onclick = function(e) {
      e.preventDefault();
      window.postMessage(e.target.href);
      e.stopPropagation()
    }
  }());
`;

export default function SignInWithKompas() {
  const [uri, setUri] = useState<string>();

  useEffect(() => {
    AuthService.bindMemberToKompas().then(res => {
      setUri(res.url);
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      {uri ? (
        <WebView
          onNavigationStateChange={state => console.info('state', state)}
          // injectedJavaScript={injectScript}
          source={{uri: uri || ''}}
          userAgent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko"
          originWhitelist={['https://*', 'http://*', 'file://*', 'sms://*']}
        />
      ) : (
        <Spinner />
      )}
    </View>
  );
}
