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

import Spinner from 'react-native-loading-spinner-overlay';
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

  componentDidMount() {
    this._loadInitialState().done();
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

          {!this.state.logged_in &&
          <Button onPress={() => navigate('Login')} title="Войти и загрузить свою фотографию"/>
          }
        </Content>
      </Container>
    );
  }
}
