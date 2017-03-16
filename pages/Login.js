/**
 * Created by Delneg on 21.02.17.
 */
import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';
import appData from '../app.json'

export default class Login extends Component {
  press() {
    //execute any code here
    console.log(this,"pressed!")
  }
  onCancel(){
    this._username.setNativeProps({text: ''});
    this._password.setNativeProps({text: ''});
  }
  onSignIn(){
    console.log("Signing in...");
    let body =  JSON.stringify({
      username: this._username.username,
      password: this._password.password,
    });
    console.log(body);
    fetch(`${appData.serverHost}/api/v1/api-token-auth/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: body,
    })
      .then((response) => {
        console.log("Success!");
        console.log(response);
      })
      .catch((error) => {
        console.log("Error!");
        console.error(error);
      });
  }
  init(){
    this._username.setNativeProps({text: 'delneg'});
    this._password.setNativeProps({text: '14331433q'});
  }
  componentDidMount(){
    this.init();
  }
  render() {
    return (
      <ScrollView style={styles.scroll}>
        <Container>
          <Button
                  label="Forgot Login/Pass"
                  styles={{button: styles.alignRight, label: styles.label}}
                  onPress={this.press.bind(this)}
                   />
        </Container>
        <Container>
          <Label text="Username"/>
          <TextInput ref={component => this._username = component}
                     style={styles.textInput}
                     onChange={(event) => this.setState({username:event.nativeEvent.text})}
          />
        </Container>
        <Container>
          <Label text="Password"/>
          <TextInput ref={component => this._password = component}
                     secureTextEntry={true}
                     style={styles.textInput}
                     onChange={(event) => this.setState({password:event.nativeEvent.text})}
          />
        </Container>
        <View style={styles.footer}>
          <Container>
            <Button
              label="Sign In"
              styles={{button: styles.primaryButton, label: styles.buttonWhiteText}}
              onPress={this.onSignIn.bind(this)} />
          </Container>
          <Container>
            <Button
              label="CANCEL"
              styles={{label: styles.buttonBlackText}}
              onPress={this.onCancel.bind(this)} />
          </Container>
        </View>
      </ScrollView>
    );

  }
}
const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#E1D7D8',
    padding: 30,
    flexDirection: 'column'
  },
  label: {
    color: '#0d8898',
    fontSize: 20
  },
  alignRight: {
    alignSelf: 'flex-end'
  },
  textInput: {
    height: 80,
    fontSize: 30,
    backgroundColor: '#FFF'
  },
  buttonWhiteText: {
    fontSize: 20,
    color: '#FFF',
  },
  buttonBlackText: {
    fontSize: 20,
    color: '#595856'
  },
  primaryButton: {
    backgroundColor: '#34A853'
  },
  footer: {
    marginTop: 100
  }

});