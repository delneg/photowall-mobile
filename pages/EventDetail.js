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
  Image,
  WebView,
  AsyncStorage
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

  componentDidMount() {
    this._loadInitialState().done();
  }

  _loadInitialState = async () => {
    try {
      let value = await AsyncStorage.getItem(appData.storageKey);
      if (value !== null) {
        this.setState({logged_in: true, token: value});
        console.log(`Recovered token ${value}`)
      } else {
        console.log("Couldn't recover the token");
      }
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  };

  static navigationOptions = {
    title: ({state}) => `${state.params.event.name}`,
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
          <Text>А здесь типо WebView для {params.event.name} по id {params.event.id}</Text>
          <Text>Описание: {params.event.description}</Text>
          <Text>Начало: {params.event.start_date}, конец: {params.event.end_date}</Text>
          <WebView
            source={{uri: 'http://www.erikjohanssonphoto.com/work'}}
            style={{marginTop: 20, height: 526}}
          />
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