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
  WebView,
  Dimensions,
  AsyncStorage
} from 'react-native';
import Moment from 'moment';
import 'moment/locale/ru'
import appData from '../app.json'
import {
  Container,
  Thumbnail,
  Button,
  Card,
  CardItem,
  Badge,
  List,
  Left,
  Body,
  Right,
  Content,
  ListItem,
  Text,
  Icon,
  Fab,
  Row
} from 'native-base';

const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase();
const width = Dimensions.get('window').width;
export default class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false,
      fab_active: false
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
    title: ({state}) => `${capitalize(state.params.event.name)}`,
  };


  render() {
    const {navigate} = this.props.navigation;
    const {params} = this.props.navigation.state;
    const styles = {
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
    Moment.locale('ru');
    return (
      <Container>
        <Content>
          <Card>
            <CardItem header>
              <Text style={{fontSize: 24, fontWeight: '700'}}>{capitalize(params.event.name)}</Text>
            </CardItem>
            <CardItem>
              <Body>
              <Text>
                {capitalize(params.event.description)}
              </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Badge success><Text>Начало в {Moment(params.event.start_date).format('LLLL')}</Text></Badge>
            </CardItem>
            <CardItem>
              <Badge danger><Text>Конец в {Moment(params.event.end_date).format('LLLL')}</Text></Badge>
            </CardItem>
          </Card>

          {params.event.image_set.map((image, i) => {
            let image_url = `${appData.serverHost}${image.image}`;
            console.log(image_url);
            return <Card key={i} style={{flex: 0}}>
              <CardItem>
                <Left>
                  <Body>
                    <Text>{image.uploaded_by.username}</Text>
                    <Text note>{Moment(image.created_at).format('LLLL')}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <Image style={{height: 200, width: width}} resizeMode='cover' source={{uri: image_url}}/>
              </CardItem>
              <CardItem>
                  {image.published &&
                  <Row>
                    <Icon name="ios-checkmark-circle"/>
                    <Text>Опубликовано</Text>
                  </Row>
                  }
                  {!image.published &&
                  <Row>
                    <Icon name="ios-close-circle"/>
                    <Text>Не опубликовано</Text>
                  </Row>
                  }
              </CardItem>
            </Card>
          })}


        </Content>

        <Fab
          active={this.state.fab_active}
          direction="up"
          containerStyle={{marginLeft: 10}}
          style={{backgroundColor: '#5067FF'}}
          position="bottomRight"
          onPress={() => this.setState({fab_active: !this.state.fab_active})}>
          <Icon name="list"/>
          {this.state.logged_in &&
          <Button style={{backgroundColor: '#34A34F'}} onPress={console.log('pressed upload')}>
            <Icon name="ios-cloud-upload"/>
          </Button>
          }
          {!this.state.logged_in &&
          <Button style={{backgroundColor: '#157efc'}} onPress={() => navigate('Login')}>
            <Icon name="ios-cloud-upload"/>
          </Button>
          }
        </Fab>
      </Container>
    );
  }
}