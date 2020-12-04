import React, { Component } from 'react';
import { StyleSheet, AppRegistry, View } from 'react-native';
import Popup from './Popup';

const originRegister = AppRegistry.registerComponent;
AppRegistry.registerComponent = (appKey, component) => {
  return originRegister(appKey, function () {
    const OriginAppComponent = component();
    return class extends Component {
      render() {
        return (
          <View style={styles.container}>
            <OriginAppComponent />
            {/* 弹窗 */}
            <Popup />
          </View>
        );
      }
    };
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
