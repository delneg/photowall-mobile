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
    };
  }


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
      {image: 'http://placekitten.com/g/700/200', text: 'Мероприятие 4', 'id': 44},
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
          {lists_obj.map((obj, i) => {
            return <View key={i}>
                      <ListItem itemDivider>
                        <Text>{obj.name}</Text>
                      </ListItem>
                      <List dataArray={obj.items} renderRow={(data) =>
                        <ListItem style={styles.listItem}>
                          <TouchableHighlight style={stylesheet.backgroundImage} onPress={() => navigate('EventDetail',{'event':data})}>
                            <Image source={{uri: data.image}} >
                              <Text style={styles.hoverText}>{data.text}</Text>
                            </Image>
                          </TouchableHighlight>
                        </ListItem>
                      }/>
                   </View>
            })
          }
          {!this.state.logged_in &&
          <Button onPress={() => navigate('Login')} title="Войти и загрузить свою фотографию"/>
          }

        </Content>
      </Container>
    );
  }
}
