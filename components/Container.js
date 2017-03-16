/**
 * Created by Delneg on 21.02.17.
 */
import React, { Component } from 'react';

import {
  StyleSheet,
  View
} from 'react-native';

const Container = (props) => {
  return (
    <View style={styles.labelContainer}>
      { props.children }
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    marginBottom: 20
  }
});

export default Container;