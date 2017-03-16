/**
 * Created by Delneg on 16.03.17.
 */
import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Button,
  Image
} from 'react-native';
import appData from '../app.json'
import {Container, List, Left, Body, Right, Content, ListItem, Text} from 'native-base';


export default class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false,
    };
  }


  static navigationOptions = {
    title: ({state}) => `${state.params.event.text}`,
  };


  render() {
    const {navigate} = this.props.navigation;
    const {params} = this.props.navigation.state;
    const styles = {
      backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        width: null,
        height: null,
        opacity: 0.6,

      },
      hoverText: {
        opacity: 1,
        fontSize: 48,
      },
      listItem: {
        padding: 0,
        margin: 0,

      },
    };

    return (
      <Container>
        <Content>
          <Text>А здесь типо WebView для {params.event.text} по id {params.event.id}</Text>
          {!this.state.logged_in &&
          <Button onPress={() => navigate('Login')} title="Войти и загрузить свою фотографию"/>
          }
          {this.state.logged_in &&
          <Button onPress={() => navigate('Upload')} title="Загрузить свою!"/>
          }

        </Content>
      </Container>
    );
  }
}