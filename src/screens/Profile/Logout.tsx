import React from 'react'
import {View} from 'react-native';
import WebView from 'react-native-webview';

type Props = {
  onLoadEnd: () => void;
};

export default function Logout(props: Props) {
  // const redirect_uri = 'bormar://auth-me';
  // 'https://account.kompas.id/sso/check?redirect_uri=https://my.borobudurmarathon.com/dev.titudev.com/api/v1/kompasid/login/auth&client_id=3&state=borobudur_marathon&scope=nama%20lengkap,%20alamat,%20Alamat%20email%20dan%20mengirimkan%20pesan&response_type=code';

  // const url =
  //   'https://account.kompas.id/sso/check?client_id=3&state=borobudur_marathon&scope=nama%20lengkap,%20alamat,%20Alamat%20email%20dan%20mengirimkan%20pesan&response_type=code&redirect_uri=' +
  //   encodeURIComponent(redirect_uri);

  // const jsCode = `
  //   function deleteAllCookies() {
  //     const cookies = document.cookie.split(";");

  //     for (let i = 0; i < cookies.length; i++) {
  //         const cookie = cookies[i];
  //         const eqPos = cookie.indexOf("=");
  //         const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  //         document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  //     }
  //   }
  //   deleteAllCookies();
  // `;
  const url = 'https://account.kompas.id/logout';

  return (
    <View style={{flex: 1}}>
      <WebView
        // source={{uri: 'https://my.borobudurmarathon.com'}}
        source={{uri: url}}
        originWhitelist={['*']}
        // injectedJavaScript={jsCode}
        onLoadEnd={props.onLoadEnd}
      />
    </View>
  );
}
