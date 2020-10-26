import React, { useEffect, useMemo } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from "react-native";

const IPHONE_USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

export const LiveChat = ({ old }) => {
  const clientId = '5b4adb0b-a87a-48a0-9a18-3136d34793a7';
  const username = 'stevesteve';
  const email = 'steve.stevenson@neds.com';
  const scriptURL = old ?
    'https://storage.googleapis.com/snapengage/tmpjs/ladbrokes-4118.js' :
    'https://storage.googleapis.com/code.snapengage.com/js/a185545f-0fe2-4382-ba56-96d12ed99937.js';

  const html = `
  <!doctype html>
  <html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <!-- needed -->
    <script type="text/javascript" src="${scriptURL}"></script>
    <style>
      #designstudio-button { display: none; }
      .designstudio-animated, .designstudio-fadeOut, .designstudio-fadeInUp, .designstudio-fadeInDown, .designstudio-fadeInLeft, .designstudio-fadeInRight, .designstudio-fadeOutUp, .designstudio-fadeOutDown, .designstudio-fadeOutLeft, .designstudio-fadeOutRight, .designstudio-slideInDown, .designstudio-slideInLeft, .designstudio-slideInRight, .designstudio-slideInUp {
        -webkit-animation: none !important;
        -moz-animation: none !important;
        -o-animation: none !important;
        -ms-animation: none !important;
        animation: none !important;
        animation-name: none !important;
        -webkit-animation-name: none !important;
      }
    </style></head><body></body></html>
  `;

  const runScript = `
    // webview -> react-native
    var postMessage = function (obj) {
      window.ReactNativeWebView.postMessage(JSON.stringify(obj));
    };

    // start cookie polyfill
    var cookieStore = {};
    document.__defineGetter__('cookie', function () {
      var output = [];
      for (var cookieName in cookieStore) {
        output.push(cookieName + "=" + cookieStore[cookieName]);
      }
      postMessage({ type: 'setCookie', data: JSON.stringify(cookieStore) });
      return output.join(";");
    });
    document.__defineSetter__('cookie', function (s) {
      var indexOfSeparator = s.indexOf("=");
      var key = s.substr(0, indexOfSeparator);
      var value = s.substring(indexOfSeparator + 1);

      cookieStore[key] = value;
      return key + "=" + value;
    });
    document.clearCookies = function () {
      cookieStore = {};
      postMessage({ type: 'deleteCookie' });
    };

    try {
      window.client_id = '${clientId}';
      // https://developer.snapengage.com/javascript-api/#api-placement-and-availability
      var se = document.createElement('script'); se.type = 'text/javascript'; se.async = true;
      se.src = '${scriptURL}';
      var done = false;
      se.onerror = function(error) {
        postMessage({ type: 'error', data: e.message + "<br />" +e.stack });
      }
      se.onload = se.onreadystatechange = function() {
        if (!done&&(!this.readyState||this.readyState==='loaded'||this.readyState==='complete')) {
          done = true;
          postMessage({ type: 'log', data: 'script loaded' });
          postMessage({ type: 'log', data: 'type of SnapEngage: ' + typeof SnapEngage });
          SnapEngage.setUserEmail('${email}', true);
          SnapEngage.setUserName('${username}');
          SnapEngage.startLink();
          // should not be used but handled anyway incase snapengage fires some internal events
          SnapEngage.setCallback('Close', function() { postMessage({ type: 'close' }) });
          SnapEngage.setCallback('Minimize', function() { postMessage({ type: 'minimize' }) });
          // iframe css overrides
          var css = \`
            #header-mobile {
              display:none;
            }
            #main-mobile {
              margin: 0px !important;
              width: 100% !important;
              height: 100% !important;
            }
            #background {
              height: 100% !important;
            }
          \`,
              head = document.getElementById('designstudio-iframe').contentDocument.head,
              style = document.createElement('style');
          head.appendChild(style);
          style.type = 'text/css';
          style.appendChild(document.createTextNode(css));
        }
      };
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(se, s);
    } catch (e) {
      postMessage({ type: 'error', data: e.message + "<br />" +e.stack });
    }
    true; //required in react-native-webview
  `;

  const onMessage = ({ type, data }) => {
    console.log(`LiveChat${old ? '[OLD]' : ''}[${type}]:`, data)
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        injectedJavaScript={ runScript }
        onMessage={ (event) => onMessage(JSON.parse(event.nativeEvent.data)) }
        userAgent={ IPHONE_USER_AGENT }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
