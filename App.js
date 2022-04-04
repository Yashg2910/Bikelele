import React, {useEffect, useRef, useState} from 'react';
import { StyleSheet, BackHandler, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const webview = useRef(null);
  const [spinnerVisible, setSpinnerVisible] = useState(true);

  const onAndroidBackPress = () => {
    if (webview.current) {
      webview.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
    };
  }, []);

  return (
    <>
      <WebView 
        style={styles.container}
        source={{ uri: 'https://bikelele.com/' }}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
