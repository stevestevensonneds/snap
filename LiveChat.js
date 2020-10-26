import React from 'react';
import { WebView } from 'react-native-webview';

export const LiveChat = () => {
  // const scriptURL = 'https://storage.googleapis.com/snapengage/tmpjs/ladbrokes-4118.js';
  const scriptURL = 'https://storage.googleapis.com/code.snapengage.com/js/a185545f-0fe2-4382-ba56-96d12ed99937.js';

  const html = '<!doctype html><html><head></head><body></body></html>';

  const runScript = `
    // webview -> react-native
    var postMessage = function (obj) {
      window.ReactNativeWebView.postMessage(JSON.stringify(obj));
    };
    try {
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
          postMessage({ type: 'log', data: 'script loaded with type of SnapEngage: ' + typeof SnapEngage });
        }
      };
      var s = document.getElementsByTagName('head')[0]; s.appendChild(se);
    } catch (e) {
      postMessage({ type: 'error', data: e.message + "<br />" +e.stack });
    }
    true; //required in react-native-webview
  `;

  const onMessage = ({ type, data }) => {
    console.log(`LiveChat[${type}]:`, data)
  };

  return (
    <WebView
      source={{ html }}
      injectedJavaScript={ runScript }
      onMessage={ (event) => onMessage(JSON.parse(event.nativeEvent.data)) }
    />
  );
};
