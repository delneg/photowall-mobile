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
  TouchableHighlight,
  AsyncStorage
} from 'react-native';


// import Button from '../components/Button';
import Label from '../components/Label';
import appData from '../app.json'
import {Container, List, Left, Body, Right, Content, ListItem, Text} from 'native-base';


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

  componentDidMount() {
    this._loadInitialState().done();
    fetch(`${appData.serverHost}/api/events/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log('Success!');
        this.state.events = responseJson.results;
        this.state.loaded = true;
      })
      .catch((error) => {
        console.log("Error!");
        console.error(error);
      });
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

    title: 'Список мероприятий',
  };


  render() {
    const {navigate} = this.props.navigation;
    const styles = {
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
    };
    const stylesheet = StyleSheet.create(styles);
    let moscow_items = [
      {image: 'http://placekitten.com/g/500/200', text: 'Мероприятие 1', 'id': 356},
      {image: 'http://placekitten.com/g/400/200', text: 'Мероприятие 2', 'id': 123},
      {image: 'http://placekitten.com/g/600/200', text: 'Мероприятие 3', 'id': 32},
    ];
    let piter_items = [
      {image: 'http://placekitten.com/g/700/200', text: 'Мероприятие 8797', 'id': 44},
      {image: 'http://placekitten.com/g/300/200', text: 'Мероприятие 5', 'id': 56},
      {image: 'http://placekitten.com/g/800/200', text: 'Мероприятие 6', 'id': 66},
    ];
    let lists_obj = [
      {'items': moscow_items, 'name': 'Москва'},
      {'items': piter_items, 'name': 'Питер'}
    ];
    return (
      <Container>
        <Content>
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

          {!this.state.logged_in &&
          <Button onPress={() => navigate('Login')} title="Войти и загрузить свою фотографию"/>
          }
        </Content>
      </Container>
    );
  }
}
