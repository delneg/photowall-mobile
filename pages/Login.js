/**
 * Created by Delneg on 21.02.17.
 */
import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  AsyncStorage
} from 'react-native';
import Toast from 'react-native-root-toast';
import {Container, Form, Spinner, Item, Right, Content, ListItem, Text, Input, Button, Label} from 'native-base';
import appData from '../app.json'

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false
  }
    ;
  }

  async _onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  onCancel() {
    this._username.setNativeProps({text: ''});
    this._password.setNativeProps({text: ''});
  }

  onSignIn() {
    console.log("Signing in...");
    this.setState({loading: true});
    let body = JSON.stringify({
      username: this.state.username,
      password: this.state.password,
    });
    fetch(`${appData.serverHost}/api/v1/api-token-auth/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: body,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({loading: false});

        if (responseJson.token) {
          console.log(`Signed in succesfully with token ${responseJson.token}`);
          this._onValueChange(appData.storageKey, responseJson.token);
          this.props.navigation.goBack();
        } else {
          console.log(`Failed to sign in, error: \n${JSON.stringify(responseJson)}`);
          let offset = 0;
          if (responseJson.username) {
            let message = `Логин: ${responseJson.username.join('\n')}`;
            let toast = Toast.show(message, {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
            });
            offset += 50;
          }
          if (responseJson.password) {
            let message = `Пароль: ${responseJson.password.join('\n')}`;
            let toast = Toast.show(message, {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM - offset,
              shadow: true,
              animation: true,
              hideOnPress: true,
            });
            offset += 30;
          }
          if (responseJson.non_field_errors) {
            let message = `${responseJson.non_field_errors.join('\n')}`;
            let toast = Toast.show(message, {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM - offset,
              shadow: true,
              animation: true,
              hideOnPress: true,
            });
          }

        }

      })
      .catch((error) => {
        console.log("Error!");
        console.error(error);
      });
  }

  static navigationOptions = {
    title: 'Вход',
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <Container>
        <Content>
          <Form>
            <Item>
              <Label>Логин</Label>
              <Input ref={(c) => {
                this._username = c
              }}
                     onChangeText={(username) => this.setState({username})}
              />
            </Item>
            <Item last>
              <Label>Пароль</Label>
              <Input ref={(c) => {
                this._password = c
              }}
                     secureTextEntry={true}
                     onChangeText={(password) => this.setState({password})}
              />
            </Item>
            <Button block onPress={this.onSignIn.bind(this)}>
              {this.state.loading &&
                <Spinner color='green' />
              }
              <Text>Войти</Text>
            </Button>
          </Form>
        </Content>
      </Container>

    );

  }
}
const styles = StyleSheet.create({});