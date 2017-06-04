/**
 * Created by Delneg on 16.03.17.
 */
import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import appData from '../app.json'
import {Container, List, Button, Left, Body, Right, Content, ListItem, Text, Footer} from 'native-base';


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false,
      token: '',
      events: [],
      loaded: false
    };
  }

  _loadToken = async () => {
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

  _removeToken = async () => {
    try {
      await AsyncStorage.removeItem(appData.storageKey);
      console.log('Removed token.');
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  };

  _loadInitialData = async () => {
    fetch(`${appData.serverHost}/api/events/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log('Received initial data');
        this.setState({events: responseJson.results});
        this.setState({loaded: true});
      })
      .catch((error) => {
        console.log("Error!");
        console.error(error);
      });
  };

  logout() {
    this._removeToken().done();
    this.setState({logged_in: false, token: ''});
    this.props.navigation.navigate('Login');
  }

  componentDidMount() {
    this._loadToken().done();
    this._loadInitialData().done();
  }


  static navigationOptions = {

    title: 'Список мероприятий',
  };

  render() {
    const {navigate} = this.props.navigation;
    const styles = {
      centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
      },
      backgroundImage: {
        flex: 1,
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
      footer: {
        position: 'absolute', left: 0, right: 0, bottom: 0
      }

    };
    const stylesheet = StyleSheet.create(styles);
    return (
      <Container>
        <Content>
          <Spinner visible={!this.state.loaded} textContent={"Загрузка..."} textStyle={{color: '#FFF'}}/>
          {this.state.loaded &&
          <List dataArray={this.state.events} renderRow={(data) =>
            <ListItem style={styles.listItem}>

              <TouchableHighlight style={stylesheet.backgroundImage}
                                  onPress={() => navigate('EventDetail', {'event': data})}>
                <Image source={{uri: data.image_set[0].image}}>
                  <Text style={styles.hoverText}>{data.name}</Text>
                </Image>
              </TouchableHighlight>

            </ListItem>
          }/>
          }


        </Content>
        <View style={stylesheet.footer}>
          {!this.state.logged_in &&
          <Button full success onPress={() => navigate('Login')}>
            <Text>Войти и загрузить свою фотографию</Text>
          </Button>
          }
          {this.state.logged_in &&
          <Button full warning onPress={this.logout.bind(this)}>
            <Text>Выйти</Text>
          </Button>
          }
        </View>
      </Container>
    );
  }
}
