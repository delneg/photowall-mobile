/**
 * Created by Delneg on 16.03.17.
 */
import React, {Component} from 'react';
import {
  AppRegistry,
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import Login from './Login';
import HomeScreen from './EventsList'
import EventDetail from './EventDetail'


const App = StackNavigator({
  Home:        {screen: HomeScreen},
  Login:       {screen: Login},
  EventDetail: {screen: EventDetail},

});

AppRegistry.registerComponent('photowall', () => App);