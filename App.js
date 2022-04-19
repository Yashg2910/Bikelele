import React, {useEffect, useRef, useState} from 'react';
import { StyleSheet, BackHandler, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export default function App() {
  const baseUri = "https://bikelele.com/";
  const webview = useRef(null);
  const [spinnerVisible, setSpinnerVisible] = useState(true);
  const [uri, setUri] = useState(`${baseUri}`);

  const onAndroidBackPress = () => {
    if (webview.current) {
      webview.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setUri(`${baseUri}?dtoken=${token}`);
    });

    BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
    };
  }, []);

  return (
    <>
      <WebView 
        style={styles.container}
        source={{ uri }}
        ref={webview}
        onLoadProgress={({nativeEvent}) => {
          if (nativeEvent.progress < 1) {
            setSpinnerVisible(true);
          }
        }}
        onLoadStart={() => setSpinnerVisible(true)}
        onLoadEnd={() => setSpinnerVisible(false)}
      />
      {spinnerVisible &&
        <ActivityIndicator
          style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}} 
          size="large" 
          color="#f9b800"/>}
    </>
  );

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
